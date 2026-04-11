"use client";

import { useState, useRef, useCallback, type FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

/**
 * Chat input bar — text field + send button.
 * Auto-focuses after send. Disabled while AI is "typing".
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
    [value, onSend, disabled],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-light-brown/20 bg-cream px-4 py-3"
    >
      {/* Text input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask for yourself or a friend..."
        disabled={disabled}
        className="flex-1 rounded-full bg-white px-4 py-2.5 text-sm text-text shadow-sm outline-none placeholder:text-grey/50 focus:ring-2 focus:ring-light-brown/30 disabled:opacity-50"
      />

      {/* Send button */}
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-brown text-white transition-opacity disabled:opacity-30"
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
    </form>
  );
}
