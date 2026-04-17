import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

/**
 * Yjs provider that rides on an existing WebRTC DataChannel.
 * Replaces the y-websocket approach bashar had that required a separate
 * Node server in the backend and caused the "YJS sync race" bug.
 *
 * Protocol (matches y-websocket's wire format so future migration is trivial):
 *   byte 0 = MESSAGE_TYPE
 *     0 = sync step (delegates to y-protocols/sync)
 *     1 = awareness update (delegates to y-protocols/awareness)
 *     2 = query awareness (respond with full awareness state)
 *
 * On DC open, both peers issue sync step 1 (announces local state vector).
 * The other peer answers with step 2 (diff). This is the y-websocket
 * handshake without needing a server.
 */

const MSG_SYNC = 0;
const MSG_AWARENESS = 1;
const MSG_QUERY_AWARENESS = 2;

export interface YjsProvider {
  doc: Y.Doc;
  awareness: awarenessProtocol.Awareness;
  /**
   * Resolves once the peer has acknowledged our sync-step-1 (the remote has
   * applied our state vector's delta + replied). After this resolves, it's safe
   * for the joiner to create its MonacoBinding — the binding will apply the
   * host's content rather than overwriting it with the joiner's local starter.
   */
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

  // Binary protocol over the DC — flip to binaryType explicitly.
  dc.binaryType = "arraybuffer";

  const send = (data: Uint8Array) => {
    if (dc.readyState === "open") {
      // Cast: lib0's Uint8Array is generic over ArrayBufferLike; DataChannel.send
      // needs a concrete ArrayBuffer. Slice copies into a known-ArrayBuffer-backed
      // buffer so TS and the runtime both agree.
      const buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
      dc.send(buf);
    }
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
    // Don't echo updates we just applied from the peer.
    if (origin === dc) return;
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
      // step2 (response to our step1) means the peer has sent us everything it
      // has and our doc is now caught up with the remote. Safe to attach the
      // editor binding now.
      if (responded === syncProtocol.messageYjsSyncStep2 && !syncCompleted) {
        syncCompleted = true;
        resolveSynced();
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
    // Sync handshake: both peers send step 1 on open.
    // The side with more recent changes responds with step 2.
    sendSync((encoder) => syncProtocol.writeSyncStep1(encoder, doc));
    // Also query peer's full awareness state.
    const awEncoder = encoding.createEncoder();
    encoding.writeVarUint(awEncoder, MSG_QUERY_AWARENESS);
    send(encoding.toUint8Array(awEncoder));
    // Share our local awareness right away.
    sendAwareness([doc.clientID]);
  };

  doc.on("update", onDocUpdate);
  awareness.on("update", onAwarenessUpdate);
  dc.addEventListener("message", onMessage);
  dc.addEventListener("open", onOpen);

  if (dc.readyState === "open") onOpen();

  // If there's no remote state (host's initial DC open before any data), the
  // host's "synced" should resolve immediately — they're authoritative. Their
  // Y.Doc is the source of truth so waiting for sync-step-2 from nobody would
  // hang forever. The provider knows who the initiator is implicitly by
  // checking if we seeded content: if the doc already has data when the DC
  // opens, we're the initiator.
  if (dc.readyState === "open" && doc.store.clients.size > 0) {
    // Host already has content — resolve immediately.
    if (!syncCompleted) {
      syncCompleted = true;
      resolveSynced!();
    }
  }

  const destroy = () => {
    doc.off("update", onDocUpdate);
    awareness.off("update", onAwarenessUpdate);
    dc.removeEventListener("message", onMessage);
    dc.removeEventListener("open", onOpen);
    awareness.destroy();
  };

  return { doc, awareness, synced, destroy };
}
