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
      <div className="bg-cream/20 text-cream flex h-20 w-20 items-center justify-center rounded-full text-2xl font-light">
        {CURRENT_USER.username.charAt(0).toUpperCase()}
      </div>

      {/* Username (primary) + assistant name (secondary) */}
      <h2 className="text-cream mt-4 text-lg">@{CURRENT_USER.username}</h2>
      <p className="text-cream/60 mt-1 text-xs">Assistant: {CURRENT_USER.privateAssistantName}</p>

      {/* Stats row */}
      <div className="mt-4 flex gap-8">
        <div className="flex flex-col items-center">
          <span className="text-cream text-lg font-medium">{likedItems.length}</span>
          <span className="text-cream/60 text-xs tracking-wider uppercase">Liked</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-cream text-lg font-medium">{dislikedItems.length}</span>
          <span className="text-cream/60 text-xs tracking-wider uppercase">Dismissed</span>
        </div>
      </div>
    </div>
  );
}
