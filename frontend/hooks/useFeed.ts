"use client";

import { useState, useCallback, useRef } from "react";
import type { FeedItem } from "@/lib/types/feed";
import { FEED_MOCK } from "@/lib/data/feedMock";
import { useTaste } from "@/contexts/TasteContext";

const PAGE_SIZE = 8;

interface UseFeedReturn {
  /** Currently visible items (excludes liked/disliked). */
  items: FeedItem[];
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
 * Writes liked/disliked items into the global TasteContext so the
 * Profile page can read them. Data source is mock for now — will
 * swap to API calls in Phase 7.
 */
export function useFeed(): UseFeedReturn {
  const { addLike, addDislike } = useTaste();
  const pageRef = useRef(1);

  /** Map of every item ever loaded — for look-up when liking/disliking. */
  const allItemsRef = useRef<Map<string, FeedItem>>(new Map());

  const [items, setItems] = useState<FeedItem[]>(() => {
    const initial = FEED_MOCK.slice(0, PAGE_SIZE);
    initial.forEach((i) => allItemsRef.current.set(i.id, i));
    return initial;
  });
  const [hasMore, setHasMore] = useState(FEED_MOCK.length > PAGE_SIZE);

  const loadMore = useCallback(() => {
    const nextPage = pageRef.current + 1;
    const start = (nextPage - 1) * PAGE_SIZE;
    const batch = FEED_MOCK.slice(start, start + PAGE_SIZE);

    if (batch.length > 0) {
      pageRef.current = nextPage;
      batch.forEach((i) => allItemsRef.current.set(i.id, i));
      setItems((prev) => [...prev, ...batch]);
    }

    if (start + PAGE_SIZE >= FEED_MOCK.length) {
      setHasMore(false);
    }
  }, []);

  const like = useCallback(
    (id: string) => {
      const item = allItemsRef.current.get(id);
      if (item) addLike(item);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [addLike]
  );

  const dislike = useCallback(
    (id: string) => {
      const item = allItemsRef.current.get(id);
      if (item) addDislike(item);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [addDislike]
  );

  return { items, hasMore, loadMore, like, dislike };
}
