"use client";

import type { editor as monacoEditor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import type * as awarenessProtocol from "y-protocols/awareness";
import * as Y from "yjs";
import { createYjsOverDataChannel } from "../lib/yjsOverDataChannel";
import { attachRemoteCursorLabels } from "../lib/remoteCursorWidgets";

/**
 * Binds a Monaco editor to a Y.Doc synced over a WebRTC DataChannel,
 * with IndexedDB persistence so state survives page refresh mid-session.
 *
 * Refresh lifecycle:
 *   - Each session gets its own IDB database: pair-session-{sessionId}.
 *   - On mount the doc is hydrated from IDB (IndexeddbPersistence.whenSynced)
 *     BEFORE we look at seeding or create the MonacoBinding. That way a
 *     refreshed peer restores the collaborative state rather than starting
 *     from scratch and either wiping it or duplicating the starter code.
 *   - Host seeds starter code ONLY if, after IDB hydration, the Y.Text is
 *     still empty — i.e. this is a genuinely fresh session, not a reload.
 *   - Joiner never seeds; they rely on the sync handshake (or IDB if they
 *     had seen this session before).
 *   - Session end (leave) should clear the IDB entry — the provider does
 *     that via clearYjsPersistence(sessionId).
 */

export interface UseYjsMonacoOptions {
  editor: monacoEditor.IStandaloneCodeEditor | null;
  dataChannel: RTCDataChannel | null;
  sessionId: number | null;
  username?: string;
  color?: string;
  isInitiator: boolean;
}

export interface YjsMonacoState {
  doc: Y.Doc | null;
  awareness: awarenessProtocol.Awareness | null;
  ready: boolean;
}

const dbNameFor = (sessionId: number) => `pair-session-${sessionId}`;

export async function clearYjsPersistence(sessionId: number): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;
  await new Promise<void>((resolve) => {
    const req = window.indexedDB.deleteDatabase(dbNameFor(sessionId));
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}

export function useYjsMonaco(opts: UseYjsMonacoOptions): YjsMonacoState {
  const { editor, dataChannel, sessionId, username, color, isInitiator } = opts;
  const [ready, setReady] = useState(false);
  const docRef = useRef<Y.Doc | null>(null);
  const awarenessRef = useRef<awarenessProtocol.Awareness | null>(null);

  useEffect(() => {
    if (!editor || !dataChannel || sessionId == null) return;

    const model = editor.getModel();
    if (!model) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      // y-monaco + y-indexeddb import monaco-editor / window at module load,
      // so we lazy-import here to keep the SSR pre-render tree clean.
      const { MonacoBinding } = await import("y-monaco");
      const { IndexeddbPersistence } = await import("y-indexeddb");
      if (cancelled) return;

      const doc = new Y.Doc();
      const yText = doc.getText("monaco");

      // 1. Hydrate from IDB first. If this peer has been in the session
      //    before (including before a refresh), their Y.Doc history is
      //    restored and the sync handshake will just reconcile deltas.
      const persistence = new IndexeddbPersistence(dbNameFor(sessionId), doc);
      await persistence.whenSynced;
      if (cancelled) {
        await persistence.destroy();
        doc.destroy();
        return;
      }

      // 2. Seed starter code only if nothing was restored AND we're the
      //    host. Both sides seeding would duplicate the starter. A reloaded
      //    host already has content from IDB so they don't re-seed.
      if (isInitiator && yText.length === 0) {
        const initialValue = model.getValue();
        if (initialValue.length > 0) yText.insert(0, initialValue);
      }

      // 3. Establish the DataChannel-backed provider + wait for the sync
      //    handshake so MonacoBinding doesn't briefly paint an empty doc
      //    over the editor.
      const provider = createYjsOverDataChannel(doc, dataChannel, {
        name: username,
        color,
      });
      await provider.synced;
      if (cancelled) {
        provider.destroy();
        await persistence.destroy();
        doc.destroy();
        return;
      }

      // 4. Final safety: if we're the host and nothing landed via sync or
      //    IDB, seed now. Covers the case where sync-step-2 from an empty
      //    joiner races our own setup.
      if (isInitiator && yText.length === 0) {
        const initialValue = model.getValue();
        if (initialValue.length > 0) yText.insert(0, initialValue);
      }

      const editorsSet = new Set([editor]);
      const binding = new MonacoBinding(yText, model, editorsSet, provider.awareness);
      const detachCursorLabels = attachRemoteCursorLabels(
        editor,
        doc,
        yText,
        provider.awareness
      );

      docRef.current = doc;
      awarenessRef.current = provider.awareness;
      setReady(true);

      cleanup = () => {
        setReady(false);
        detachCursorLabels();
        binding.destroy();
        provider.destroy();
        // Don't delete the IDB — we want state to survive refresh. It's
        // cleared explicitly on session end by the provider.
        persistence.destroy();
        doc.destroy();
        docRef.current = null;
        awarenessRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, dataChannel, sessionId]);

  return { doc: docRef.current, awareness: awarenessRef.current, ready };
}
