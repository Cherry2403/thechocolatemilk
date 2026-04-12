"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "@/lib/types/chat";
import { getMockResponse } from "@/lib/data/chatMock";

/** Simulated AI thinking delay range (ms). */
const AI_DELAY_MIN = 800;
const AI_DELAY_MAX = 2000;

/**
 * Per-contact chat state manager.
 *
 * Stores messages keyed by contact ID so each conversation persists
 * independently across contact switches.
 *
 * Callbacks are referentially stable (don't change identity on re-render)
 * to avoid cascading re-renders in consumers.
 *
 * Data source is mock (keyword-matching) for now — will swap to
 * backend API call in Phase 7/9.
 */
export function useChat() {
  const [chatMap, setChatMap] = useState<Record<string, ChatMessage[]>>({});
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});
  const idCounter = useRef(0);

  /* ── Refs mirror state so callbacks stay stable ── */
  const chatMapRef = useRef(chatMap);
  chatMapRef.current = chatMap;

  const typingMapRef = useRef(typingMap);
  typingMapRef.current = typingMap;

  /** Get messages for a specific contact. */
  const getMessages = useCallback((contactId: string | null): ChatMessage[] => {
    if (!contactId) return [];
    return chatMapRef.current[contactId] ?? [];
  }, []);

  /** Check if a contact's assistant is currently "typing". */
  const getIsTyping = useCallback((contactId: string | null): boolean => {
    if (!contactId) return false;
    return typingMapRef.current[contactId] ?? false;
  }, []);

  /** Get the last message for a contact (used for contact list preview). */
  const getLastMessage = useCallback(
    (contactId: string): { content: string; timestamp: string } | null => {
      const msgs = chatMapRef.current[contactId];
      if (!msgs || msgs.length === 0) return null;
      const last = msgs[msgs.length - 1];
      return { content: last.content, timestamp: last.timestamp };
    },
    []
  );

  /** Send a message within a specific contact's conversation. */
  const sendMessage = useCallback((contactId: string, content: string) => {
    /* ── 1. Add user message immediately ── */
    const userMsg: ChatMessage = {
      id: `msg-${++idCounter.current}`,
      userId: "user-01",
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setChatMap((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] ?? []), userMsg],
    }));
    setTypingMap((prev) => ({ ...prev, [contactId]: true }));

    /* ── 2. Simulate AI thinking delay ── */
    const delay = AI_DELAY_MIN + Math.random() * (AI_DELAY_MAX - AI_DELAY_MIN);

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

      setChatMap((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] ?? []), assistantMsg],
      }));
      setTypingMap((prev) => ({ ...prev, [contactId]: false }));
    }, delay);
  }, []);

  return { chatMap, getMessages, getIsTyping, getLastMessage, sendMessage };
}
