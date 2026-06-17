"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ChatMode } from "@/lib/data/chatMock";
import { getSuggestions } from "@/lib/data/chatSuggestions";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  mode: ChatMode;
  isFriend: boolean;
}

export default function ChatInput({ onSend, disabled, mode, isFriend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>(() => getSuggestions(mode, isFriend));

  /* Reshuffle when mode or contact changes */
  useEffect(() => {
    setSuggestions(getSuggestions(mode, isFriend));
  }, [mode, isFriend]);

  const reshuffle = useCallback(() => {
    setSuggestions(getSuggestions(mode, isFriend));
  }, [mode, isFriend]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setValue("");
      reshuffle();
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [value, onSend, disabled, reshuffle]
  );

  const handleSuggestion = useCallback(
    (q: string) => {
      if (disabled) return;
      onSend(q);
      reshuffle();
    },
    [onSend, disabled, reshuffle]
  );

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-light-brown/10 border-t">
      {/* Suggested questions */}
      <div className="flex gap-2 overflow-x-auto px-4 pt-3 pb-1 [scrollbar-width:none]">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSuggestion(q)}
            disabled={disabled}
            className="text-cream/70 border-cream/20 hover:border-cream/40 hover:text-cream flex-shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition-colors disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isFriend ? "ask about their taste..." : "ask for yourself or a friend..."}
            disabled={disabled}
            className="text-text placeholder:text-grey/50 focus:ring-light-brown/30 flex-1 rounded-full bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="bg-dark-brown flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
