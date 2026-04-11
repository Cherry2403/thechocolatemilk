"use client";

import { useTaste } from "@/contexts/TasteContext";
import { CURRENT_USER } from "@/lib/data/userMock";

/**
 * Profile header — avatar initial, display name, username, and stats.
 */
export default function ProfileHeader() {
  const { likedItems, dislikedItems } = useTaste();

  return (
    <div className="flex flex-col items-center px-6 py-6">
      {/* Avatar placeholder — first letter of username */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-light-brown/30 text-2xl font-light text-dark-brown">
        {CURRENT_USER.username.charAt(0).toUpperCase()}
      </div>

      {/* Username (primary) + assistant name (secondary) */}
      <h2 className="mt-3 text-base font-medium text-text">
        @{CURRENT_USER.username}
      </h2>
      <p className="text-xs text-grey/50">
        Assistant: {CURRENT_USER.privateAssistantName}
      </p>

      {/* Stats row */}
      <div className="mt-4 flex gap-8">
        <div className="flex flex-col items-center">
          <span className="text-lg font-medium text-dark-brown">
            {likedItems.length}
          </span>
          <span className="text-xs uppercase tracking-wider text-grey/60">
            Liked
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-medium text-dark-brown">
            {dislikedItems.length}
          </span>
          <span className="text-xs uppercase tracking-wider text-grey/60">
            Dismissed
          </span>
        </div>
      </div>
    </div>
  );
}
