import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

/**
 * Yjs provider that rides on an existing WebRTC DataChannel.
 * Replaces the y-websocket approach bashar had that required a separate
 * Node server and caused the original "YJS sync race" bug.
 *
 * Wire format matches y-websocket so a future migration is trivial:
 *   byte 0 = MESSAGE_TYPE
 *     0 = sync step (delegates to y-protocols/sync)
 *     1 = awareness update (delegates to y-protocols/awareness)
 *     2 = query awareness (respond with full awareness state)
 *
 * Both peers send sync-step-1 on DC open; each resolves its `synced`
 * promise when it receives sync-step-2 from the remote. A 5-second
 * timeout is in place as a safety net — if the handshake stalls we
 * still attach the MonacoBinding (the doc may just be empty) rather
 * than block the UI forever.
 */

const MSG_SYNC = 0;
const MSG_AWARENESS = 1;
const MSG_QUERY_AWARENESS = 2;

const SYNC_TIMEOUT_MS = 5_000;

export interface YjsProvider {
  doc: Y.Doc;
  awareness: awarenessProtocol.Awareness;
  synced: Promise<void>;
  destroy: () => void;
}

export function createYjsOverDataChannel(
  doc: Y.Doc,
  dc: RTCDataChannel,
  options: { name?: string; color?: string } = {}
): YjsProvider {
  const awareness = new awarenessProtocol.Awareness(doc);
  awareness.setLocalStateField("user", {
    name: options.name ?? "anonymous",
    color: options.color ?? "#4f46e5",
  });

  let resolveSynced: () => void;
  const synced = new Promise<void>((resolve) => {
    resolveSynced = resolve;
  });
  let syncCompleted = false;
  const markSynced = () => {
    if (!syncCompleted) {
      syncCompleted = true;
      resolveSynced();
    }
  };

  const syncTimeout = setTimeout(() => {
    if (!syncCompleted) {
      console.warn("[yjs/dc] sync handshake timed out — attaching binding anyway");
      markSynced();
    }
  }, SYNC_TIMEOUT_MS);

  dc.binaryType = "arraybuffer";

  const send = (data: Uint8Array) => {
    if (dc.readyState !== "open") return;
    // lib0's Uint8Array view may not be backed by a concrete ArrayBuffer —
    // slice into a fresh one so DataChannel.send is happy.
    const buf = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer;
    dc.send(buf);
  };

  const sendSync = (f: (encoder: encoding.Encoder) => void) => {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MSG_SYNC);
    f(encoder);
    send(encoding.toUint8Array(encoder));
  };

  const sendAwareness = (changed: number[]) => {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MSG_AWARENESS);
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(awareness, changed)
    );
    send(encoding.toUint8Array(encoder));
  };

  const onDocUpdate = (update: Uint8Array, origin: unknown) => {
    if (origin === dc) return; // don't echo updates we got from the peer
    sendSync((encoder) => syncProtocol.writeUpdate(encoder, update));
  };

  const onAwarenessUpdate = (
    { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
    origin: unknown
  ) => {
    if (origin === "remote") return;
    sendAwareness([...added, ...updated, ...removed]);
  };

  const onMessage = (ev: MessageEvent) => {
    const data = ev.data;
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array();
    const decoder = decoding.createDecoder(bytes);
    const messageType = decoding.readVarUint(decoder);

    if (messageType === MSG_SYNC) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MSG_SYNC);
      const responded = syncProtocol.readSyncMessage(decoder, encoder, doc, dc);
      if (encoding.length(encoder) > 1 && responded !== syncProtocol.messageYjsSyncStep2) {
        send(encoding.toUint8Array(encoder));
      }
      // Our sync-step-1 has been answered — the remote has sent us every
      // op it has. Safe to paint the editor now.
      if (responded === syncProtocol.messageYjsSyncStep2) {
        markSynced();
      }
    } else if (messageType === MSG_AWARENESS) {
      awarenessProtocol.applyAwarenessUpdate(
        awareness,
        decoding.readVarUint8Array(decoder),
        "remote"
      );
    } else if (messageType === MSG_QUERY_AWARENESS) {
      sendAwareness(Array.from(awareness.getStates().keys()));
    }
  };

  const onOpen = () => {
    // Handshake: both peers issue step 1 on open; the side with state
    // responds with step 2 containing the delta.
    sendSync((encoder) => syncProtocol.writeSyncStep1(encoder, doc));
    const awEncoder = encoding.createEncoder();
    encoding.writeVarUint(awEncoder, MSG_QUERY_AWARENESS);
    send(encoding.toUint8Array(awEncoder));
    sendAwareness([doc.clientID]);
  };

  doc.on("update", onDocUpdate);
  awareness.on("update", onAwarenessUpdate);
  dc.addEventListener("message", onMessage);
  dc.addEventListener("open", onOpen);

  if (dc.readyState === "open") onOpen();

  const destroy = () => {
    clearTimeout(syncTimeout);
    doc.off("update", onDocUpdate);
    awareness.off("update", onAwarenessUpdate);
    dc.removeEventListener("message", onMessage);
    dc.removeEventListener("open", onOpen);
    awareness.destroy();
  };

  return { doc, awareness, synced, destroy };
}
