"use client";

import Image from "next/image";
import type { ChatMessage } from "@/lib/types/chat";

interface ChatBubbleProps {
  message: ChatMessage;
}

/**
 * Single chat message bubble.
 *
 * User messages: right-aligned, dark-brown bg, white text.
 * Assistant messages: left-aligned, white/glass bg, dark text.
 *
 * Supports inline GIF display and product suggestion cards.
 * Timestamps are handled by the parent (Messenger-style separators).
 */
export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser
            ? "bg-dark-brown rounded-2xl rounded-br-md text-white"
            : "text-text rounded-2xl rounded-bl-md bg-white/80 shadow-sm"
        }`}
      >
        {/* ── Text content ── */}
        {message.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        {/* ── GIF (optional, for AI personality) ── */}
        {message.gif && (
          <div className="mt-2 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={message.gif} alt="" className="h-auto w-full max-w-[200px] rounded-lg" />
          </div>
        )}

        {/* ── Product suggestions (horizontal scroll) ── */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {message.suggestions.map((item) => (
              <div key={item.id} className="bg-cream w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 object-cover"
                />
                <div className="px-1.5 py-1">
                  <p className="text-text/70 truncate text-[10px]">{item.name}</p>
                  {item.price != null && (
                    <p className="text-dark-brown text-[10px] font-medium">${item.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
