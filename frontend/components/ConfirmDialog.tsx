"use client";

import { type ReactNode } from "react";

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
 * Modal confirmation dialog.
 * Used for actions like removing connections that need user confirmation.
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
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onCancel}
        role="presentation"
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-light-brown/10 px-6 py-4">
          <h2 className="text-base font-medium text-text">{title}</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-sm text-grey/70">{message}</p>
        </div>

        {/* Actions */}
        <div className="border-t border-light-brown/10 flex gap-3 px-6 py-4">
          <button
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
