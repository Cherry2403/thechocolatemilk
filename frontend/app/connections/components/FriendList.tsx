"use client";

import type { Connection } from "@/lib/types/connection";

interface FriendListProps {
  connections: Connection[];
  onRemove: (id: string) => void;
}

/**
 * Scrollable list of accepted friends.
 * Shows username (primary) + assistant name (secondary) — no preference data.
 */
export default function FriendList({ connections, onRemove }: FriendListProps) {
  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm italic text-grey/50">No connections yet.</p>
        <p className="mt-1 text-xs text-grey/40">
          Search above to add friends.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4">
      <h3 className="pb-2 pt-3 text-xs font-medium uppercase tracking-widest text-grey/60">
        Friends ({connections.length})
      </h3>
      <div className="divide-y divide-light-brown/10">
        {connections.map((conn) => (
          <div key={conn.id} className="flex items-center gap-3 py-3">
            {/* Avatar initial */}
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-light-brown/20 text-sm font-medium text-dark-brown">
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

            {/* Remove action */}
            <button
              type="button"
              onClick={() => onRemove(conn.id)}
              className="px-2 py-1 text-xs text-grey/40 transition-colors hover:text-dark-red"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
