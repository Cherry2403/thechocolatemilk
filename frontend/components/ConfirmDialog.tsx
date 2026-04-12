"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean; // Red theme for destructive actions
}

/**
 * Accessible modal confirmation dialog.
 *
 * Features:
 * - `role="alertdialog"` + `aria-modal` for screen readers
 * - `aria-labelledby` / `aria-describedby` for context
 * - Focus trap: Tab cycles within dialog, Shift+Tab reverses
 * - Escape key closes the dialog
 * - Auto-focuses cancel button on open (safer default)
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  /* ── Focus trap + Escape key ── */
  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus the cancel button (safer default for destructive actions)
    cancelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
        return;
      }

      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg"
      >
        {/* Header */}
        <div className="border-b border-light-brown/10 px-6 py-4">
          <h2 id="confirm-dialog-title" className="text-base font-medium text-text">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p id="confirm-dialog-desc" className="text-sm text-grey/70">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-light-brown/10 px-6 py-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg bg-light-brown/10 px-4 py-2 text-sm font-medium text-dark-brown transition-colors hover:bg-light-brown/20"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
              isDangerous
                ? "bg-dark-red hover:bg-dark-red/90"
                : "bg-dark-brown hover:bg-dark-brown/90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
