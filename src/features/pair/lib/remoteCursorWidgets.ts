import type { editor as monacoEditor } from "monaco-editor";
import * as Y from "yjs";
import type * as awarenessProtocol from "y-protocols/awareness";

/**
 * Renders a floating username label above each remote peer's caret.
 * y-monaco's MonacoBinding already paints the selection range and a thin
 * caret marker via .yRemoteSelection / .yRemoteSelectionHead decorations,
 * but it doesn't render the user's NAME anywhere — this closes that gap
 * with a Monaco content widget per remote client.
 *
 * Implementation:
 *   - One monaco IContentWidget per remote clientID.
 *   - getPosition() is computed on the fly from the Yjs relative selection
 *     in awareness state, so the label tracks the caret even when OUR
 *     own edits shift its absolute offset.
 *   - Awareness changes (remote cursor moved) and doc updates (content
 *     shifted) both call editor.layoutContentWidget() to reposition.
 */

interface RemoteUserState {
  name?: string;
  color?: string;
}

interface RemoteAwarenessState {
  user?: RemoteUserState;
  selection?: {
    anchor: Y.RelativePosition;
    head: Y.RelativePosition;
  };
}

const ABOVE_PREF = 1; // monaco.editor.ContentWidgetPositionPreference.ABOVE
const BELOW_PREF = 2; // monaco.editor.ContentWidgetPositionPreference.BELOW

export function attachRemoteCursorLabels(
  editor: monacoEditor.IStandaloneCodeEditor,
  doc: Y.Doc,
  yText: Y.Text,
  awareness: awarenessProtocol.Awareness
): () => void {
  const widgets = new Map<number, monacoEditor.IContentWidget>();
  const localClientID = awareness.clientID;

  const getWidgetPosition = (
    clientID: number
  ): monacoEditor.IContentWidgetPosition | null => {
    const state = awareness.getStates().get(clientID) as
      | RemoteAwarenessState
      | undefined;
    if (!state?.selection?.head) return null;
    const absHead = Y.createAbsolutePositionFromRelativePosition(
      state.selection.head,
      doc
    );
    if (!absHead || absHead.type !== yText) return null;
    const model = editor.getModel();
    if (!model) return null;
    const monacoPos = model.getPositionAt(absHead.index);
    return {
      position: { lineNumber: monacoPos.lineNumber, column: monacoPos.column },
      preference: [ABOVE_PREF, BELOW_PREF],
    };
  };

  const createDomNode = (user: RemoteUserState): HTMLElement => {
    const el = document.createElement("div");
    el.className = "yRemoteCursorLabel";
    el.textContent = user.name ?? "anonymous";
    const color = user.color ?? "#4f46e5";
    el.style.backgroundColor = color;
    el.style.color = pickContrastingTextColor(color);
    return el;
  };

  const upsert = (clientID: number) => {
    if (clientID === localClientID) return;
    const state = awareness.getStates().get(clientID) as
      | RemoteAwarenessState
      | undefined;
    if (!state?.user || !state.selection) {
      remove(clientID);
      return;
    }
    const existing = widgets.get(clientID);
    if (existing) {
      const dom = existing.getDomNode();
      dom.textContent = state.user.name ?? "anonymous";
      const color = state.user.color ?? "#4f46e5";
      dom.style.backgroundColor = color;
      dom.style.color = pickContrastingTextColor(color);
      editor.layoutContentWidget(existing);
      return;
    }
    const dom = createDomNode(state.user);
    const widget: monacoEditor.IContentWidget = {
      getId: () => `yjs-remote-cursor-${clientID}`,
      getDomNode: () => dom,
      getPosition: () => getWidgetPosition(clientID),
    };
    editor.addContentWidget(widget);
    widgets.set(clientID, widget);
  };

  const remove = (clientID: number) => {
    const w = widgets.get(clientID);
    if (!w) return;
    editor.removeContentWidget(w);
    widgets.delete(clientID);
  };

  const relayoutAll = () => {
    for (const widget of widgets.values()) {
      editor.layoutContentWidget(widget);
    }
  };

  const onAwarenessChange = ({
    added,
    updated,
    removed,
  }: {
    added: number[];
    updated: number[];
    removed: number[];
  }) => {
    for (const id of added) upsert(id);
    for (const id of updated) upsert(id);
    for (const id of removed) remove(id);
  };

  // When OUR edits shift the document, the remote caret's absolute offset
  // changes even though the remote relative position didn't. Relayout all
  // widgets after every Y.Doc update.
  const onDocUpdate = () => relayoutAll();

  awareness.on("change", onAwarenessChange);
  doc.on("update", onDocUpdate);

  // Seed for already-known remotes.
  for (const clientID of awareness.getStates().keys()) upsert(clientID);

  return () => {
    awareness.off("change", onAwarenessChange);
    doc.off("update", onDocUpdate);
    for (const widget of widgets.values()) {
      try {
        editor.removeContentWidget(widget);
      } catch {
        // Editor may have been disposed by Monaco's own teardown before
        // our cleanup landed — removing widgets off a dead editor throws.
      }
    }
    widgets.clear();
  };
}

function pickContrastingTextColor(bgHex: string): string {
  const hex = bgHex.replace(/^#/, "");
  if (hex.length !== 3 && hex.length !== 6) return "#ffffff";
  const norm =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const r = parseInt(norm.slice(0, 2), 16);
  const g = parseInt(norm.slice(2, 4), 16);
  const b = parseInt(norm.slice(4, 6), 16);
  // Rec. 709 luminance — threshold at ~0.55 keeps vivid colors like indigo
  // rendering with white text, pastels with black.
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luma > 0.55 ? "#111111" : "#ffffff";
}
