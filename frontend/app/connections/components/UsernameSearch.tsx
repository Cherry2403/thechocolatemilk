"use client";

import { useState, useCallback, useRef } from "react";
import { SEARCH_RESULTS_MOCK, type SearchResult } from "@/lib/data/connectionsMock";

/** Debounce delay for search input (ms). */
const SEARCH_DEBOUNCE_MS = 300;

interface UsernameSearchProps {
  /** Callback when user taps "Connect" on a search result. */
  onAdd: (userId: string, username: string, assistantName: string) => void;
  /** IDs of already-connected / pending friends (to filter from results). */
  existingIds: Set<string>;
}

/**
 * Live-search bar that filters mock users by username.
 * Debounced at 300ms to avoid filtering on every keystroke.
 * In production this calls `GET /api/connections/search?username=<query>`.
 */
export default function UsernameSearch({ onAdd, existingIds }: UsernameSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      clearTimeout(debounceRef.current);

      if (value.trim().length < 2) {
        setResults([]);
        return;
      }

      debounceRef.current = setTimeout(() => {
        // Mock search — filter by username, exclude existing friends/pending
        const filtered = SEARCH_RESULTS_MOCK.filter(
          (u) => u.username.toLowerCase().includes(value.toLowerCase()) && !existingIds.has(u.id)
        );
        setResults(filtered);
      }, SEARCH_DEBOUNCE_MS);
    },
    [existingIds]
  );

  return (
    <div>
      <h3 className="mb-4 text-sm">Find Friends</h3>
      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by username..."
        className="text-text placeholder:text-grey/50 focus:ring-light-brown/30 w-full rounded-full bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2"
      />

      {/* Results dropdown */}
      {results.length > 0 && (
        <div className="divide-light-brown/10 mt-3 divide-y overflow-hidden rounded-xl bg-white shadow-sm">
          {results.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3">
              {/* Avatar initial */}
              <div className="bg-light-brown/20 text-dark-brown flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {user.username.charAt(0).toUpperCase()}
              </div>

              {/* Username (primary) + assistant name (secondary) */}
              <div className="min-w-0 flex-1">
                <p className="text-text text-sm font-medium">@{user.username}</p>
                <p className="text-grey/50 text-[11px]">Assistant: {user.privateAssistantName}</p>
              </div>

              {/* Connect button */}
              <button
                type="button"
                onClick={() => {
                  onAdd(user.id, user.username, user.privateAssistantName);
                  setQuery("");
                  setResults([]);
                }}
                className="bg-dark-brown/10 text-dark-brown hover:bg-dark-brown/20 rounded-full px-3 py-1 text-xs font-medium transition-colors"
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
