"use client";

import type { ChatContact } from "@/lib/types/chat";
import { formatChatTime } from "@/lib/utils/time-ago";

interface ChatContactListProps {
  contacts: ChatContact[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

/**
 * Sidebar contact list for the chat page.
 * Each row represents a friend's AI assistant (or the user's own).
 * Sorted by most recent message (latest conversation on top).
 * Desktop: always-visible left panel. Mobile: full-screen until a contact is selected.
 */
export default function ChatContactList({ contacts, activeId, onSelect }: ChatContactListProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-light-brown/15 border-b px-4 py-3">
        <h2 className="text-grey/60 text-xs font-medium tracking-widest uppercase">
          Conversations
        </h2>
      </div>

      {/* Contact rows */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => {
          const isActive = contact.id === activeId;
          return (
            <button
              key={contact.id}
              type="button"
              onClick={() => onSelect(contact.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive ? "bg-light-brown/15" : "hover:bg-light-brown/8"
              }`}
            >
              {/* Avatar initial */}
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  contact.isOwnAssistant
                    ? "bg-green/10 text-green"
                    : "bg-light-brown/20 text-dark-brown"
                }`}
              >
                {contact.assistantName.charAt(0).toUpperCase()}
              </div>

              {/* Info + last message */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-text truncate text-sm font-medium">{contact.assistantName}</p>
                  {contact.lastMessageTime && (
                    <span className="text-grey/40 flex-shrink-0 text-[10px]">
                      {formatChatTime(contact.lastMessageTime)}
                    </span>
                  )}
                </div>
                <p className="text-grey/50 truncate text-[11px]">
                  {contact.lastMessage
                    ? contact.lastMessage
                    : contact.isOwnAssistant
                      ? "Your personal assistant"
                      : `@${contact.username}`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
