"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { FeedItem } from "@/lib/types/feed";

/* ── Context shape ── */

interface TasteContextValue {
  /** Items the user has hearted (newest first, deduplicated). */
  likedItems: FeedItem[];
  /** Items the user has dismissed (newest first, deduplicated). */
  dislikedItems: FeedItem[];
  /** Move an item into liked (and out of disliked if present). */
  addLike: (item: FeedItem) => void;
  /** Move an item into disliked (and out of liked if present). */
  addDislike: (item: FeedItem) => void;
  /** Undo a like — removes from liked list. */
  removeLike: (id: string) => void;
  /** Undo a dislike — removes from disliked list. */
  removeDislike: (id: string) => void;
}

const TasteContext = createContext<TasteContextValue | null>(null);

/* ── Provider ── */

export function TasteProvider({ children }: { children: ReactNode }) {
  const [likedItems, setLikedItems] = useState<FeedItem[]>([]);
  const [dislikedItems, setDislikedItems] = useState<FeedItem[]>([]);

  /* ── Actions ── */

  const addLike = useCallback((item: FeedItem) => {
    setLikedItems((prev) => {
      // Deduplicate — skip if already present
      if (prev.some((i) => i.id === item.id)) return prev;
      return [item, ...prev];
    });
    // Remove from disliked if present
    setDislikedItems((prev) => prev.filter((i) => i.id !== item.id));
  }, []);

  const addDislike = useCallback((item: FeedItem) => {
    setDislikedItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [item, ...prev];
    });
    // Remove from liked if present
    setLikedItems((prev) => prev.filter((i) => i.id !== item.id));
  }, []);

  const removeLike = useCallback((id: string) => {
    setLikedItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const removeDislike = useCallback((id: string) => {
    setDislikedItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <TasteContext.Provider
      value={{
        likedItems,
        dislikedItems,
        addLike,
        addDislike,
        removeLike,
        removeDislike,
      }}
    >
      {children}
    </TasteContext.Provider>
  );
}

/* ── Consumer hook ── */

export function useTaste() {
  const ctx = useContext(TasteContext);
  if (!ctx) throw new Error("useTaste must be used within <TasteProvider>");
  return ctx;
}
