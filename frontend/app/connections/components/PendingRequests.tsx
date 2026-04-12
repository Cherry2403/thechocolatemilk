"use client";

import { useState } from "react";
import type { Connection } from "@/lib/types/connection";

interface PendingRequestsProps {
  incoming: Connection[];
  outgoing: Connection[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

/**
 * Pending connection requests section.
 * Shows incoming requests (accept/decline) and outgoing requests (waiting).
 * Preview shows 3 latest; "Show all" expands the full list.
 * Sits above the accepted friends list on the same page.
 */
export default function PendingRequests({
  incoming,
  outgoing,
  onAccept,
  onDecline,
}: PendingRequestsProps) {
  const [expanded, setExpanded] = useState(false);
  const total = incoming.length + outgoing.length;

  if (total === 0) return null;

  const PREVIEW_COUNT = 3;
  const previewIncoming = expanded ? incoming : incoming.slice(0, PREVIEW_COUNT);
  const showOutgoing = expanded;
  const hasMore = total > PREVIEW_COUNT;

  return (
    <div className="px-4 pt-3 pb-2">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-grey/60 text-xs font-medium tracking-widest uppercase">
          Pending {total > 0 && `(${total})`}
        </h3>
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="text-dark-brown/70 hover:text-dark-brown text-xs transition-colors"
          >
            {expanded ? "Show less" : "Show all"}
          </button>
        )}
      </div>

      {/* Incoming requests */}
      <div className="divide-light-brown/10 mt-2 space-y-0 divide-y">
        {previewIncoming.map((conn) => (
          <div key={conn.id} className="flex items-center gap-3 py-3">
            {/* Avatar initial */}
            <div className="bg-light-pink/40 text-dark-brown flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
              {conn.friendUsername.charAt(0).toUpperCase()}
            </div>

            {/* Username (primary) + assistant name (secondary) */}
            <div className="min-w-0 flex-1">
              <p className="text-text truncate text-sm font-medium">@{conn.friendUsername}</p>
              {conn.friendAssistantName && (
                <p className="text-grey/50 truncate text-[11px]">
                  Assistant: {conn.friendAssistantName}
                </p>
              )}
            </div>

            {/* Accept / Decline buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onAccept(conn.id)}
                className="bg-green/10 text-green hover:bg-green/20 rounded-full px-3 py-1 text-xs font-medium transition-colors"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => onDecline(conn.id)}
                className="bg-dark-red/5 text-dark-red/60 hover:bg-dark-red/10 rounded-full px-3 py-1 text-xs font-medium transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        ))}

        {/* Outgoing requests — only shown when expanded */}
        {showOutgoing &&
          outgoing.map((conn) => (
            <div key={conn.id} className="flex items-center gap-3 py-3">
              <div className="bg-light-brown/15 text-dark-brown/60 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {conn.friendUsername.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-text/70 truncate text-sm font-medium">@{conn.friendUsername}</p>
                {conn.friendAssistantName && (
                  <p className="text-grey/40 truncate text-[11px]">
                    Assistant: {conn.friendAssistantName}
                  </p>
                )}
              </div>
              <span className="text-grey/40 text-[11px] italic">Requested</span>
            </div>
          ))}
      </div>

      {/* Divider between pending and accepted */}
      <div className="border-light-brown/20 mt-2 border-b" />
    </div>
  );
}
