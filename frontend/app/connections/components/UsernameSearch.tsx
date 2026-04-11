"use client";

import { useState, useCallback } from "react";
import {
  SEARCH_RESULTS_MOCK,
  type SearchResult,
} from "@/lib/data/connectionsMock";

interface UsernameSearchProps {
  /** Callback when user taps "Connect" on a search result. */
  onAdd: (userId: string, username: string, assistantName: string) => void;
  /** IDs of already-connected / pending friends (to filter from results). */
  existingIds: Set<string>;
}

/**
 * Live-search bar that filters mock users by username.
 * In production this calls `GET /api/connections/search?username=<query>`.
 */
export default function UsernameSearch({
  onAdd,
  existingIds,
}: UsernameSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);

      if (value.trim().length < 2) {
        setResults([]);
        return;
      }

      // Mock search — filter by username, exclude existing friends/pending
      const filtered = SEARCH_RESULTS_MOCK.filter(
        (u) =>
          u.username.toLowerCase().includes(value.toLowerCase()) &&
          !existingIds.has(u.id),
      );
      setResults(filtered);
    },
    [existingIds],
  );

  return (
    <div className="px-4 py-3">
      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by username..."
        className="w-full rounded-full bg-white px-4 py-2.5 text-sm text-text shadow-sm outline-none placeholder:text-grey/50 focus:ring-2 focus:ring-light-brown/30"
      />

      {/* Results dropdown */}
      {results.length > 0 && (
        <div className="mt-2 divide-y divide-light-brown/10 overflow-hidden rounded-xl bg-white shadow-sm">
          {results.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3">
              {/* Avatar initial */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-light-brown/20 text-sm font-medium text-dark-brown">
                {user.username.charAt(0).toUpperCase()}
              </div>

              {/* Username (primary) + assistant name (secondary) */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text">
                  @{user.username}
                </p>
                <p className="text-[11px] text-grey/50">
                  Assistant: {user.privateAssistantName}
                </p>
              </div>

              {/* Connect button */}
              <button
                type="button"
                onClick={() => {
                  onAdd(user.id, user.username, user.privateAssistantName);
                  setQuery("");
                  setResults([]);
                }}
                className="rounded-full bg-dark-brown/10 px-3 py-1 text-xs font-medium text-dark-brown transition-colors hover:bg-dark-brown/20"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
