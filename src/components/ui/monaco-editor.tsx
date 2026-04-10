/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { cn } from "@/lib";
import Editor from "@monaco-editor/react";
import { EditorKeyBinding } from "@/context/EditorSettingsContext";
import * as Y from "yjs";
import * as awarenessProtocols from "y-protocols/awareness";

function useMonacoShortcuts(params: {
  keyBinding: EditorKeyBinding;
  onRunShortcut?: () => void;
  onSubmitShortcut?: () => void;
  editorRef: React.MutableRefObject<any | null>;
  monacoRef: React.MutableRefObject<any | null>;
}) {
  const { keyBinding, onRunShortcut, onSubmitShortcut, editorRef, monacoRef } =
    params;

  React.useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    let runKeybinding: number | null = null;
    let submitKeybinding: number | null = null;

    switch (keyBinding) {
      case "vscode":
        runKeybinding = monaco.KeyMod.CtrlCmd | monaco.KeyCode.Comma;
        submitKeybinding = monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter;
        break;

      case "sublime":
        runKeybinding = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB;
        submitKeybinding =
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyB;
        break;

      case "vim":
        runKeybinding = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR;
        submitKeybinding =
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR;
        break;
    }

    if (onRunShortcut && runKeybinding !== null) {
      editor.addCommand(runKeybinding, () => onRunShortcut());
    }

    if (onSubmitShortcut && submitKeybinding !== null) {
      editor.addCommand(submitKeybinding, () => onSubmitShortcut());
    }

    editor.addAction({
      id: "format-document-shortcut",
      label: "Format Document",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      ],
      run: (ed: any) => {
        const formatAction = ed.getAction("editor.action.formatDocument");
        return formatAction?.run();
      },
    });
  }, [keyBinding, onRunShortcut, onSubmitShortcut, editorRef, monacoRef]);
}

type Props = {
  value?: string;
  tabSize?: number;
  fontSize?: number;
  language?: string;
  className?: string;
  defaultValue?: string;
  autoComplete?: boolean;
  wordWrap?: "on" | "off";
  height?: number | string;
  onRunShortcut?: () => void;
  onSubmitShortcut?: () => void;
  options?: Record<string, any>;
  keyBinding?: EditorKeyBinding;
  onChange?: (value: string) => void;
  theme?: "light" | "vs-dark" | "hc-black";
  editorRef?: React.MutableRefObject<any | null>;
  pairingSessionId?: number | string | null;
  dataChannel?: RTCDataChannel | null;
  isConnected?: boolean;
  userName?: string;
  /** "broadcast" = host (seeds initial code), "join" = partner (waits for sync) */
  pairingMode?: "broadcast" | "join" | null;
};

const DARK_THEME_NAME = "custom-dark";

export const MonacoCodeEditer = ({
    value,
    editorRef,
    options,
    onChange,
    tabSize = 2,
    defaultValue,
    onRunShortcut,
    fontSize = 14,
    className = "",
    wordWrap = "on",
    onSubmitShortcut,
    theme = "vs-dark",
    autoComplete = true,
    keyBinding = "vscode",
    language = "javascript",
    pairingSessionId,
    dataChannel,
    isConnected,
    userName,
    pairingMode,
  }: Props) => {
    const internalEditorRef = React.useRef<any | null>(null);
    const monacoRef = React.useRef<any | null>(null);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      if (editorRef) {
        editorRef.current = internalEditorRef.current;
      }
    }, [editorRef]);

    useMonacoShortcuts({
      keyBinding,
      onRunShortcut,
      onSubmitShortcut,
      editorRef: internalEditorRef,
      monacoRef,
    });

    React.useEffect(() => {
      const monaco = monacoRef.current;
      if (!monaco) return;

      monaco.editor.defineTheme(DARK_THEME_NAME, {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: { "editor.background": "#0D1A26" },
      });

      monaco.editor.setTheme(theme === "vs-dark" ? DARK_THEME_NAME : theme);
    }, [theme]);

    const isYjsInitializedRef = React.useRef(false);
    
    // Stable YJS doc & awareness — recreated per session to clear lingering states, stale clocks, and old text!
    const doc = React.useMemo(() => {
        isYjsInitializedRef.current = false;
        return new Y.Doc();
    }, [pairingSessionId]);
    const awareness = React.useMemo(() => new awarenessProtocols.Awareness(doc), [doc]);
    // Stable random color per component mount
    const myColorRef = React.useRef<string | null>(null);
    if (!myColorRef.current) {
      const COLORS = ['#FF6B6B', '#51CF66', '#339AF0', '#FCC419', '#CC5DE8', '#22B8CF', '#FF922B'];
      myColorRef.current = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    // Handle YJS Real-time Synchronization using WebRTC DataChannel
    React.useEffect(() => {
      if (!isMounted || !pairingSessionId || !dataChannel || !isConnected) {
         console.log("[YJS] Skipping init — missing deps:", { isMounted, pairingSessionId, hasDC: !!dataChannel, isConnected });
         return;
      }
      
      const editor = internalEditorRef.current;
      if (!editor) {
        console.log("[YJS] Skipping init — editor not ready");
        return;
      }

      console.log("[YJS] Initializing collaboration for session", pairingSessionId, "mode:", pairingMode, "DC state:", dataChannel.readyState);

      let destroyed = false;
      let heartbeatInterval: NodeJS.Timeout;
      
      // Ensure binary mode for DataChannel
      dataChannel.binaryType = "arraybuffer";

      const sendOverChannel = (type: number, payload: Uint8Array) => {
        if (destroyed) return;
        if (dataChannel.readyState !== "open") return;
        const msg = new Uint8Array(payload.length + 1);
        msg[0] = type;
        msg.set(payload, 1);
        try {
            dataChannel.send(msg);
        } catch (e) {
            console.error("[YJS WebRTC] Send error", e);
        }
      };

      // Use addEventListener instead of direct assignment to avoid overwriting
      const handleDCMessage = async (event: MessageEvent) => {
        if (destroyed) return;
        let buffer: ArrayBuffer;
        if (event.data instanceof Blob) {
            buffer = await event.data.arrayBuffer();
        } else if (event.data instanceof ArrayBuffer) {
            buffer = event.data;
        } else {
            console.warn("[YJS WebRTC] Unexpected message data type:", typeof event.data);
            return;
        }
        const data = new Uint8Array(buffer);
        if (data.length === 0) return;
        const type = data[0];
        const payload = data.slice(1);
        if (type === 0) {
            console.log("[YJS] Received doc update from peer, size:", payload.length);
            Y.applyUpdate(doc, payload, "webrtc");
        } else if (type === 1) {
            awarenessProtocols.applyAwarenessUpdate(awareness, payload, "webrtc");
        } else if (type === 2) {
            // Sync request: peer is asking us to send our full state
            console.log("[YJS] Received sync request from peer, sending full state");
            const state = Y.encodeStateAsUpdate(doc);
            sendOverChannel(0, state);
            const awarenessState = awarenessProtocols.encodeAwarenessUpdate(awareness, [doc.clientID]);
            sendOverChannel(1, awarenessState);
        }
      };

      dataChannel.addEventListener("message", handleDCMessage);

      const syncFullState = () => {
        if (destroyed) return;
        console.log("[YJS] Syncing full state over DataChannel");
        const state = Y.encodeStateAsUpdate(doc);
        sendOverChannel(0, state);
         
        const awarenessState = awarenessProtocols.encodeAwarenessUpdate(awareness, [doc.clientID]);
        sendOverChannel(1, awarenessState);
      };

      // Send a sync request (type 2) asking the peer to send their full state.
      // This handles the race condition where the peer's state was sent
      // BEFORE our message listener was registered and was lost.
      const requestSync = () => {
        if (destroyed) return;
        console.log("[YJS] Requesting sync from peer");
        sendOverChannel(2, new Uint8Array(0));
      };

      const handleDCOpen = () => {
        console.log("[YJS] DataChannel opened, syncing state");
        syncFullState();
        // Also request the peer's state in case they sent before we were ready
        setTimeout(() => requestSync(), 500);
      };

      if (dataChannel.readyState === "open") {
          // Already open — sync immediately + request peer's state
          syncFullState();
          setTimeout(() => requestSync(), 500);
      } else {
          // Wait for it to open
          dataChannel.addEventListener("open", handleDCOpen);
      }

      // YJS update handler: broadcast local changes to peer
      const handleDocUpdate = (update: Uint8Array, origin: any) => {
        if (origin !== "webrtc") {
          sendOverChannel(0, update);
        }
      };

      // Awareness update handler: broadcast cursor/selection changes to peer
      const handleAwarenessUpdate = ({ added, updated, removed }: any, origin: string) => {
        if (origin !== "webrtc") {
          const changedClients = [...added, ...updated, ...removed];
          if (changedClients.length === 0) return;
          const enc = awarenessProtocols.encodeAwarenessUpdate(awareness, changedClients);
          sendOverChannel(1, enc);
        }
      };

      doc.on("update", handleDocUpdate);
      awareness.on("update", handleAwarenessUpdate);

      // Set awareness user info (color + name)
      // Extract just the username part if the string contains an email address to save space
      const displayName = userName && userName.includes('@') ? userName.split('@')[0] : userName;
      awareness.setLocalStateField('user', {
        name: displayName || 'User',
        color: myColorRef.current!,
      });

      // Setup YJS <-> Monaco binding
      // IMPORTANT: We use bindingRef (a ref, not a local variable) so that cleanup
      // can ALWAYS find and destroy the binding, even if it was created after
      // cleanup started (due to the async import).
      const bindingRef = { current: null as any };

      const setupBinding = async () => {
        if (destroyed) return;
        try {
          const { MonacoBinding } = await import("y-monaco");
          if (destroyed) {
            // Cleanup already ran while we were importing.
            // Don't create the binding.
            return;
          }
          
          const ytext = doc.getText("monaco");
          
          // CRITICAL: Only the HOST seeds the initial code into the shared YJS document.
          // The JOINER should wait to receive the synced state from the host.
          // This prevents both sides inserting the same code independently (causing duplicates).
          const isHost = pairingMode === "broadcast";
          if (isHost && !isYjsInitializedRef.current && ytext.toString() === "" && (value || defaultValue)) {
            console.log("[YJS] Host seeding initial code into shared doc");
            ytext.insert(0, value || defaultValue || "");
          }
          isYjsInitializedRef.current = true;

          const model = editor.getModel();
          if (model && !destroyed) {
              const newBinding = new MonacoBinding(ytext, model, new Set([editor]), awareness);
              bindingRef.current = newBinding;
              console.log("[YJS] MonacoBinding created successfully");

              // After binding is created, force-sync the model to Y.Text content.
              // This handles the case where updates arrived BEFORE the binding existed.
              const ytextStr = ytext.toString();
              if (model.getValue() !== ytextStr) {
                console.log("[YJS] Post-binding reconciliation: updating editor to match Y.Text");
                model.setValue(ytextStr);
              }

              // Request a fresh sync from the peer now that our binding is ready
              if (dataChannel.readyState === "open") {
                console.log("[YJS] Post-binding: requesting sync from peer");
                sendOverChannel(2, new Uint8Array(0));
              }
          }
        } catch (error) {
          console.error("[YJS] Initialization error", error);
        }
      };

      setupBinding();

      // Heartbeat: periodically sync full state + awareness for resilience
      heartbeatInterval = setInterval(() => {
        if (destroyed) return;
        if (dataChannel.readyState === "open") {
          const awarenessState = awarenessProtocols.encodeAwarenessUpdate(awareness, [doc.clientID]);
          sendOverChannel(1, awarenessState);
          
          // Full state sync as backup (handles missed messages)
          const state = Y.encodeStateAsUpdate(doc);
          sendOverChannel(0, state);
        }
      }, 3000);

      return () => {
        console.log(`[YJS] Cleaning up session ${pairingSessionId}`);
        destroyed = true;
        
        // Clear our local state from awareness so remaining remote peers update their UI
        try { awareness.setLocalState(null); } catch (e) {}

        // Destroy binding — using bindingRef so we always find it, even if
        // it was created asynchronously after the effect body finished.
        const currentBinding = bindingRef.current;
        if (currentBinding) {
          try { 
            const model = internalEditorRef.current?.getModel?.();
            if (model) {
              const decoIds: string[] = [];
              if (currentBinding._decorations) {
                for (const ids of currentBinding._decorations.values()) {
                  decoIds.push(...(Array.isArray(ids) ? ids : [ids]));
                }
              }
              const allDecorations = model.getAllDecorations();
              for (const deco of allDecorations) {
                 if (deco.options.className?.includes('yRemoteSelection')) {
                     decoIds.push(deco.id);
                 }
              }
              internalEditorRef.current?.deltaDecorations(decoIds, []);
            }
            currentBinding.destroy(); 
          } catch (e) { 
            console.error("[YJS] Error clearing decorations", e);
          }
          bindingRef.current = null;
        }
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        doc.off("update", handleDocUpdate);
        awareness.off("update", handleAwarenessUpdate);
        dataChannel.removeEventListener("message", handleDCMessage);
        dataChannel.removeEventListener("open", handleDCOpen);
      };
    // NOTE: `language` is intentionally excluded — changing language should NOT
    // re-initialize the YJS binding (it destroys shared state).
    // `value` and `defaultValue` are also excluded — they only matter for initial seeding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, pairingSessionId, dataChannel, isConnected, doc, awareness, userName, pairingMode]);

    // Inject dynamic CSS for remote cursors based on awareness state
    React.useEffect(() => {
      const styleId = 'yjs-cursor-styles';
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      const updateStyles = () => {
        const states = awareness.getStates();
        let css = `
          /* Base styles for all remote cursor labels */
          .yRemoteSelectionHead::before {
            position: absolute;
            top: -1.4em;
            left: -2px;
            padding: 1px 6px;
            font-size: 11px;
            font-weight: 600;
            line-height: 1.4;
            border-radius: 3px 3px 3px 0;
            white-space: nowrap;
            pointer-events: none;
            z-index: 100;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .yRemoteSelectionHead::after {
            position: absolute;
            top: 0;
            left: -2px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
          }
          .yRemoteSelectionHead {
            position: relative;
          }
        `;
        states.forEach((state: any, clientId: number) => {
          if (clientId !== doc.clientID && state.user) {
            const { color, name } = state.user;
            // Escape name for CSS content
            const escapedName = (name || 'User').replace(/"/g, '\\"');
            css += `
              .yRemoteSelection-${clientId} { background-color: ${color}33 !important; }
              .yRemoteSelectionHead-${clientId} { border-left: 2px solid ${color} !important; position: relative; }
              .yRemoteSelectionHead-${clientId}::after { background-color: ${color}; border-radius: 50%; width: 6px; height: 6px; }
              .yRemoteSelectionHead-${clientId}::before { 
                background-color: ${color}; 
                color: #fff;
                content: "${escapedName}";
              }
            `;
          }
        });
        styleEl!.textContent = css;
      };

      awareness.on('change', updateStyles);
      updateStyles();

      return () => {
        awareness.off('change', updateStyles);
        if (styleEl) styleEl.textContent = '';
      };
    }, [awareness, doc.clientID]);

    return (
      <div className={cn("h-full w-full", className)}>
        <Editor
          height="100%"
          language={language}
          value={pairingSessionId ? undefined : value}
          defaultValue={pairingSessionId ? value || defaultValue : defaultValue}
          onChange={(v) => onChange?.(v || "")}
          theme={theme === "vs-dark" ? DARK_THEME_NAME : theme}
          options={{
            fontSize,
            wordWrap,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            tabSize,
            detectIndentation: false,
            lineNumbersMinChars: 3,
            lineDecorationsWidth: 0,
            padding: { top: 15, bottom: 10 },
            overviewRulerBorder: false,
            renderLineHighlight: "line",
            glyphMargin: false,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            suggestOnTriggerCharacters: autoComplete,
            quickSuggestions: autoComplete,
            parameterHints: { enabled: autoComplete },
            ...options,
          }}
          onMount={(editor, monaco) => {
            console.log("Monaco editor mounted");
            internalEditorRef.current = editor;
            monacoRef.current = monaco;

            if (editorRef) {
              editorRef.current = editor;
            }

            monaco.editor.defineTheme(DARK_THEME_NAME, {
              base: "vs-dark",
              inherit: true,
              rules: [],
              colors: {
                "editor.background": "#0D1A26",
              },
            });

            monaco.editor.setTheme(
              theme === "vs-dark" ? DARK_THEME_NAME : theme,
            );

            setIsMounted(true);
          }}
        />
      </div>
    );
  };
