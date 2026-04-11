"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useChat } from "@/hooks/useChat";
import { CONNECTIONS_MOCK } from "@/lib/data/connectionsMock";
import { CURRENT_USER } from "@/lib/data/userMock";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import ChatContactList from "./components/ChatContactList";

/** A "contact" is any accepted connection + the user's own assistant. */
export interface ChatContact {
  id: string;
  username: string;
  assistantName: string;
  isOwnAssistant?: boolean;
}

export default function ChatPage() {
  /* ── Build contact list from accepted connections + self ── */
  const contacts = useMemo<ChatContact[]>(() => {
    const own: ChatContact = {
      id: "self",
      username: CURRENT_USER.username,
      assistantName: CURRENT_USER.privateAssistantName,
      isOwnAssistant: true,
    };
    const friends: ChatContact[] = CONNECTIONS_MOCK.filter(
      (c) => c.status === "accepted",
    ).map((c) => ({
      id: c.friendId ?? c.id,
      username: c.friendUsername,
      assistantName: c.friendAssistantName ?? "Assistant",
    }));
    return [own, ...friends];
  }, []);

  /* ── Selected conversation ── */
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const activeContact = contacts.find((c) => c.id === activeContactId) ?? null;

  /* ── Per-contact chat state (keyed by contact id) ── */
  const chatInstances = useRef<Map<string, ReturnType<typeof useChat>>>(
    new Map(),
  );

  // The active chat instance
  const currentChat = useChat();
  const { messages, isTyping, sendMessage } = currentChat;

  // Store chat instance reference
  useEffect(() => {
    if (activeContactId) {
      chatInstances.current.set(activeContactId, currentChat);
    }
  }, [activeContactId, currentChat]);

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
    <div className="flex h-[calc(100vh-8rem)]">
      {/* ═══ Left side: contact list ═══ */}
      {/* Desktop: always visible. Mobile: hidden when a chat is active */}
      <div
        className={`w-full flex-shrink-0 border-r border-light-brown/15 md:w-72 lg:w-80 ${
          activeContactId ? "hidden md:block" : "block"
        }`}
      >
        <ChatContactList
          contacts={contacts}
          activeId={activeContactId}
          onSelect={setActiveContactId}
        />
      </div>

      {/* ═══ Right side: conversation ═══ */}
      {/* Desktop: always visible. Mobile: hidden when no chat selected */}
      <div
        className={`flex flex-1 flex-col ${
          activeContactId ? "block" : "hidden md:flex"
        }`}
      >
        {!activeContact ? (
          /* ── Empty state (desktop) ── */
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm italic text-grey/50">
              Select a conversation to start chatting
            </p>
          </div>
        ) : (
          <>
            {/* ── Chat header ── */}
            <div className="flex items-center gap-3 border-b border-light-brown/15 px-4 py-3">
              {/* Back button — mobile only */}
              <button
                type="button"
                onClick={handleBack}
                className="mr-1 text-grey/60 md:hidden"
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

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-light-brown/20 text-xs font-medium text-dark-brown">
                {activeContact.assistantName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-text">
                  {activeContact.assistantName}
                </p>
                <p className="text-[11px] text-grey/50">
                  {activeContact.isOwnAssistant
                    ? "Your assistant"
                    : `@${activeContact.username}'s assistant`}
                </p>
              </div>
            </div>

            {/* ── Messages area ── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm italic text-grey/50">
                    {activeContact.isOwnAssistant
                      ? "Ask me about flowers, fashion, or gift ideas..."
                      : `Ask ${activeContact.assistantName} about what @${activeContact.username} would love...`}
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="mb-3 flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white/80 px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-grey/40"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-grey/40"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-grey/40"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Input bar ── */}
            <ChatInput onSend={sendMessage} disabled={isTyping} />
          </>
        )}
      </div>
    </div>
  );
}
