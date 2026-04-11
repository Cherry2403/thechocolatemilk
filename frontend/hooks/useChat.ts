"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "@/lib/types/chat";
import { getMockResponse } from "@/lib/data/chatMock";

/**
 * Manages chat state: messages, typing indicator, and mock AI responses.
 *
 * Data source is mock (keyword-matching) for now — will swap to
 * backend API call in Phase 7/9.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const idCounter = useRef(0);

  const sendMessage = useCallback((content: string) => {
    /* ── 1. Add user message immediately ── */
    const userMsg: ChatMessage = {
      id: `msg-${++idCounter.current}`,
      userId: "user-01",
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    /* ── 2. Simulate AI thinking delay (0.8 – 2 s) ── */
    const delay = 800 + Math.random() * 1200;

    setTimeout(() => {
      const mock = getMockResponse(content);

      const assistantMsg: ChatMessage = {
        id: `msg-${++idCounter.current}`,
        userId: "assistant",
        role: "assistant",
        content: mock.content,
        gif: mock.gif,
        suggestions: mock.suggestions,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, delay);
  }, []);

  return { messages, isTyping, sendMessage };
}
