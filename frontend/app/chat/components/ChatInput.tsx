"use client";

import { useState, useRef, useCallback, type FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

/**
 * Chat text input bar — text field + send button.
 *
 * Auto-focuses text input after send. Disabled while AI is "typing".
 *
 * Image upload is intentionally disabled for now (security review pending).
 * The backend upload endpoint exists and can be wired in later.
 */
export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) return;

      onSend(trimmed);
      setValue("");
      // Re-focus after a tick so the keyboard stays open on mobile
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [value, onSend, disabled]
  );

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-light-brown/10 border-t px-4 py-3"
    >
      <div className="flex items-center gap-2">
        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask for yourself or a friend..."
          disabled={disabled}
          className="text-text placeholder:text-grey/50 focus:ring-light-brown/30 flex-1 rounded-full bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 disabled:opacity-50"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          className="bg-dark-brown flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-30"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </form>
  );
}
