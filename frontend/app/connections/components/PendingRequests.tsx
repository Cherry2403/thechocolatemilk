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
    <div className="px-4 pb-2 pt-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-widest text-grey/60">
          Pending {total > 0 && `(${total})`}
        </h3>
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-dark-brown/70 transition-colors hover:text-dark-brown"
          >
            {expanded ? "Show less" : "Show all"}
          </button>
        )}
      </div>

      {/* Incoming requests */}
      <div className="mt-2 space-y-0 divide-y divide-light-brown/10">
        {previewIncoming.map((conn) => (
          <div key={conn.id} className="flex items-center gap-3 py-3">
            {/* Avatar initial */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-light-pink/40 text-sm font-medium text-dark-brown">
              {conn.friendUsername.charAt(0).toUpperCase()}
            </div>

            {/* Username (primary) + assistant name (secondary) */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">
                @{conn.friendUsername}
              </p>
              {conn.friendAssistantName && (
                <p className="truncate text-[11px] text-grey/50">
                  Assistant: {conn.friendAssistantName}
                </p>
              )}
            </div>

            {/* Accept / Decline buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onAccept(conn.id)}
                className="rounded-full bg-green/10 px-3 py-1 text-xs font-medium text-green transition-colors hover:bg-green/20"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => onDecline(conn.id)}
                className="rounded-full bg-dark-red/5 px-3 py-1 text-xs font-medium text-dark-red/60 transition-colors hover:bg-dark-red/10"
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
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-light-brown/15 text-sm font-medium text-dark-brown/60">
                {conn.friendUsername.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text/70">
                  @{conn.friendUsername}
                </p>
                {conn.friendAssistantName && (
                  <p className="truncate text-[11px] text-grey/40">
                    Assistant: {conn.friendAssistantName}
                  </p>
                )}
              </div>
              <span className="text-[11px] italic text-grey/40">
                Requested
              </span>
            </div>
          ))}
      </div>

      {/* Divider between pending and accepted */}
      <div className="mt-2 border-b border-light-brown/20" />
    </div>
  );
}
