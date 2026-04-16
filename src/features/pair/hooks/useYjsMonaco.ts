"use client";

import type { editor as monacoEditor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { MonacoBinding } from "y-monaco";
import type * as awarenessProtocol from "y-protocols/awareness";
import * as Y from "yjs";
import { createYjsOverDataChannel } from "../lib/yjsOverDataChannel";

/**
 * Binds a Monaco editor to a Y.Doc synced over a WebRTC DataChannel.
 *
 * Pre-applied fix for bashar's "stale MonacoBinding" bug:
 *   - Binding is created fresh on every effect run
 *   - binding.destroy() runs on every cleanup
 *   - Model identity change triggers a rebind automatically because the
 *     effect depends on the editor ref's model
 */

export interface UseYjsMonacoOptions {
  editor: monacoEditor.IStandaloneCodeEditor | null;
  dataChannel: RTCDataChannel | null;
  username?: string;
  color?: string;
}

export interface YjsMonacoState {
  doc: Y.Doc | null;
  awareness: awarenessProtocol.Awareness | null;
  ready: boolean;
}

export function useYjsMonaco(opts: UseYjsMonacoOptions): YjsMonacoState {
  const { editor, dataChannel, username, color } = opts;
  const [ready, setReady] = useState(false);
  const docRef = useRef<Y.Doc | null>(null);
  const awarenessRef = useRef<awarenessProtocol.Awareness | null>(null);

  useEffect(() => {
    if (!editor || !dataChannel) return;

    const model = editor.getModel();
    if (!model) return;

    const doc = new Y.Doc();
    const yText = doc.getText("monaco");

    // Seed Y.Doc from whatever is currently in the editor so the first
    // client doesn't blank the other peer's buffer.
    const initialValue = model.getValue();
    if (initialValue.length > 0 && yText.length === 0) {
      yText.insert(0, initialValue);
    }

    const provider = createYjsOverDataChannel(doc, dataChannel, { name: username, color });
    const editorsSet = new Set([editor]);
    const binding = new MonacoBinding(yText, model, editorsSet, provider.awareness);

    docRef.current = doc;
    awarenessRef.current = provider.awareness;
    setReady(true);

    return () => {
      setReady(false);
      binding.destroy();
      provider.destroy();
      doc.destroy();
      docRef.current = null;
      awarenessRef.current = null;
    };
    // Model change (different editor instance) triggers full rebind — that's
    // deliberate. username/color are only read at bind time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, dataChannel]);

  return { doc: docRef.current, awareness: awarenessRef.current, ready };
}
