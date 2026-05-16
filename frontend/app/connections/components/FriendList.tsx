"use client";

import { useState } from "react";
import type { Connection } from "@/lib/types/connection";
import ConfirmDialog from "@/components/ConfirmDialog";

interface FriendListProps {
  connections: Connection[];
  onRemove: (id: string) => void;
}

/**
 * Scrollable list of accepted friends.
 * Shows username (primary) + assistant name (secondary) — no preference data.
 */
export default function FriendList({ connections, onRemove }: FriendListProps) {
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const friendToRemove = connections.find((c) => c.id === confirmRemoveId);

  const handleConfirmRemove = () => {
    if (confirmRemoveId) {
      onRemove(confirmRemoveId);
      setConfirmRemoveId(null);
    }
  };

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-grey/50 text-sm italic">No connections yet.</p>
        <p className="text-grey/40 mt-1 text-xs">Search above to add friends.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="mb-4 text-sm">
          Friends ({connections.length})
        </h3>
        <div className="divide-light-brown/10 divide-y space-y-1">
          {connections.map((conn) => (
            <div key={conn.id} className="flex items-center gap-3 py-3 first:pt-0">
              {/* Avatar initial */}
              <div className="bg-light-brown/20 text-dark-brown flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
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

              {/* Remove action */}
              <button
                type="button"
                onClick={() => setConfirmRemoveId(conn.id)}
                className="text-grey/40 hover:text-dark-red px-2 py-1 text-xs transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm removal dialog */}
      <ConfirmDialog
        isOpen={!!confirmRemoveId}
        title="Remove connection?"
        message={
          friendToRemove ? (
            <>
              Are you sure you want to remove{" "}
              <span className="font-medium">@{friendToRemove.friendUsername}</span>? You won't be
              able to chat with their assistant or see their recommendations.
            </>
          ) : (
            "Remove this connection?"
          )
        }
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmRemoveId(null)}
        confirmText="Remove"
        cancelText="Keep"
        isDangerous
      />
    </>
  );
}
