"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { shouldShowTimeSeparator } from "@/lib/utils/time-ago";
import { CONNECTIONS_MOCK } from "@/lib/data/connectionsMock";
import { CURRENT_USER } from "@/lib/data/userMock";
import type { ChatContact } from "@/lib/types/chat";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import ChatContactList from "./components/ChatContactList";
import ChatTimeSeparator from "./components/ChatTimeSeparator";

export default function ChatPage() {
  /* ── Chat hook — manages all per-contact messages ── */
  const { chatMap, getMessages, getIsTyping, getLastMessage, sendMessage } = useChat();

  /* ── Build base contact list from accepted connections + self ── */
  const baseContacts = useMemo<ChatContact[]>(() => {
    const own: ChatContact = {
      id: "self",
      username: CURRENT_USER.username,
      assistantName: CURRENT_USER.privateAssistantName,
      isOwnAssistant: true,
    };
    const friends: ChatContact[] = CONNECTIONS_MOCK.filter((c) => c.status === "accepted").map(
      (c) => ({
        id: c.friendId ?? c.id,
        username: c.friendUsername,
        assistantName: c.friendAssistantName ?? "Assistant",
      })
    );
    return [own, ...friends];
  }, []);

  /* ── Selected conversation ── */
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const activeContact = baseContacts.find((c) => c.id === activeContactId) ?? null;
  const messages = getMessages(activeContactId);
  const isTyping = getIsTyping(activeContactId);

  /* ── Enrich contacts with last message info + sort by latest ── */
  const contacts = useMemo<ChatContact[]>(() => {
    const enriched = baseContacts.map((contact) => {
      const last = getLastMessage(contact.id);
      if (!last) return contact;
      return {
        ...contact,
        lastMessage: last.content,
        lastMessageTime: last.timestamp,
      };
    });

    // Sort: contacts with messages first (latest on top), then without messages
    return enriched.sort((a, b) => {
      if (!a.lastMessageTime && !b.lastMessageTime) return 0;
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
  }, [baseContacts, getLastMessage, chatMap]);

  /* ── Send wrapper (binds to active contact) ── */
  const handleSend = useCallback(
    (content: string) => {
      if (!activeContactId) return;
      sendMessage(activeContactId, content);
    },
    [activeContactId, sendMessage]
  );

  /* ── Auto-scroll ── */
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /* ── Back button for mobile ── */
  const handleBack = () => setActiveContactId(null);

  return (
    <div className="flex min-h-0 flex-1 gap-3 px-3 sm:px-6">
      {/* ═══ Left: contact list (cream card) ═══ */}
      {/* Desktop: always visible. Mobile: hidden when a chat is active */}
      <div
        className={`flex w-full min-h-0 flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-cream/20 text-text shadow-sm md:w-72 lg:w-80 ${
          activeContactId ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatContactList
          contacts={contacts}
          activeId={activeContactId}
          onSelect={setActiveContactId}
        />
      </div>

      {/* ═══ Right: conversation (cream card) ═══ */}
      {/* Desktop: always visible. Mobile: hidden when no chat selected */}
      <div className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-cream/20 text-text shadow-sm ${activeContactId ? "flex" : "hidden md:flex"}`}>
        {!activeContact ? (
          /* ── Empty state (desktop) ── */
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-cream text-sm italic">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* ── Chat header ── */}
            <div className="border-light-brown/10 flex items-center gap-3 border-b px-4 py-3">
              {/* Back button — mobile only */}
              <button
                type="button"
                onClick={handleBack}
                className="text-cream mr-1 md:hidden"
                aria-label="Back"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="bg-light-brown/60 text-cream flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium">
                {activeContact.assistantName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-cream text-sm font-medium">{activeContact.assistantName}</p>
                <p className="text-cream text-[11px]">
                  {activeContact.isOwnAssistant
                    ? "Your assistant"
                    : `@${activeContact.username}'s assistant`}
                </p>
              </div>
            </div>

            {/* ── Messages area ── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-cream/50 text-sm italic">
                    {activeContact.isOwnAssistant
                      ? "Ask me about flowers, fashion, or gift ideas..."
                      : `Ask ${activeContact.assistantName} about what @${activeContact.username} would love...`}
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => {
                const separator = shouldShowTimeSeparator(
                  idx > 0 ? messages[idx - 1].timestamp : null,
                  msg.timestamp
                );
                return (
                  <div key={msg.id}>
                    {separator && <ChatTimeSeparator label={separator} />}
                    <ChatBubble message={msg} />
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="mb-3 flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white/80 px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span
                        className="bg-grey/40 h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="bg-grey/40 h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="bg-grey/40 h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Input bar ── */}
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </>
        )}
      </div>
    </div>
  );
}
