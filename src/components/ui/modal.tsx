import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
type ModalScroll = "content" | "body";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  stickyFooter?: boolean;
  showClose?: boolean;
  size?: ModalSize;
  scroll?: ModalScroll;
  className?: string;
  overlayClass?: string;
  headerClass?: string;
  contentClass?: string;
  footerClass?: string;
  children: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  header,
  footer,
  stickyFooter = false,
  showClose = true,
  size = "md",
  scroll = "content",
  className,
  overlayClass,
  headerClass,
  contentClass,
  footerClass,
  children,
}: ModalProps) {
  const hasHeader = Boolean(header || title);

  const sizeClass: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    "2xl": "max-w-4xl h-[600px]",
    full: "max-w-[92vw] md:max-w-[90vw] lg:max-w-[95vw]",
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 backdrop-blur-xs bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            overlayClass
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 max-h-[90vh] flex flex-col z-50 w-[92vw] overflow-hidden -translate-x-1/2 -translate-y-1/2 rounded-xl bg-modal-background shadow-xl outline-none",
            sizeClass[size],
            className
          )}
        >
          {showClose && (
            <Dialog.Close
              className="inline-flex absolute z-50 right-2 top-2 h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={16} />
            </Dialog.Close>
          )}

          {hasHeader ? (
            <div
              className={cn(
                "sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 dark:bg-[#0D1A26]/50 backdrop-blur px-5 py-3",
                headerClass
              )}
            >
              <div className="min-w-0">
                {header ? (
                  header
                ) : (
                  <Dialog.Title className="truncate text-xl font-bold">
                    {title}
                  </Dialog.Title>
                )}
              </div>
            </div>
          ) : (
            <VisuallyHidden>
              <Dialog.Title>Modal</Dialog.Title>
            </VisuallyHidden>
          )}

          <div
            className={cn(
              scroll === "content"
                ? "min-h-0 overflow-y-auto h-full custom-scrollbar"
                : "",
              hasHeader ? "px-5 py-4" : "px-5 py-5",
              contentClass
            )}
          >
            {children}
          </div>

          {footer && (
            <div
              className={cn(
                "border-t px-5 py-3 shrink-0",
                stickyFooter
                  ? "sticky bottom-0 bg-white/80 backdrop-blur z-10"
                  : "",
                footerClass
              )}
            >
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
