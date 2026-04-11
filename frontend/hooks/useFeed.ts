"use client";

import { useState, useCallback, useRef } from "react";
import type { FeedItem } from "@/lib/types/feed";
import { FEED_MOCK } from "@/lib/data/feedMock";

const PAGE_SIZE = 8;

export interface UseFeedReturn {
  /** Currently visible items (excludes liked/disliked). */
  items: FeedItem[];
  /** IDs the user has liked. */
  liked: Set<string>;
  /** IDs the user has disliked. */
  disliked: Set<string>;
  /** Whether more items are available to load. */
  hasMore: boolean;
  /** Load the next page of items. */
  loadMore: () => void;
  /** Mark an item as liked and remove it from visible items. */
  like: (id: string) => void;
  /** Mark an item as disliked and remove it from visible items. */
  dislike: (id: string) => void;
}

/**
 * Manages feed state: pagination, like/dislike, and item removal.
 *
 * Data source is mock for now — will swap to API calls in Phase 7.
 */
export function useFeed(): UseFeedReturn {
  const pageRef = useRef(1);

  const [items, setItems] = useState<FeedItem[]>(() =>
    FEED_MOCK.slice(0, PAGE_SIZE),
  );
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [disliked, setDisliked] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(FEED_MOCK.length > PAGE_SIZE);

  const loadMore = useCallback(() => {
    const nextPage = pageRef.current + 1;
    const start = (nextPage - 1) * PAGE_SIZE;
    const batch = FEED_MOCK.slice(start, start + PAGE_SIZE);

    if (batch.length > 0) {
      pageRef.current = nextPage;
      setItems((prev) => [...prev, ...batch]);
    }

    if (start + PAGE_SIZE >= FEED_MOCK.length) {
      setHasMore(false);
    }
  }, []);

  const like = useCallback((id: string) => {
    setLiked((prev) => new Set(prev).add(id));
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const dislike = useCallback((id: string) => {
    setDisliked((prev) => new Set(prev).add(id));
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, liked, disliked, hasMore, loadMore, like, dislike };
}
