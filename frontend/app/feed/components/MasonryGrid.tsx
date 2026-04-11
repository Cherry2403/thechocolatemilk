"use client";

import {
  Children,
  useCallback,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { useColumnCount } from "@/hooks/useColumnCount";

interface MasonryGridProps {
  children: ReactNode;
  /** Fires when the sentinel at the bottom enters the viewport. */
  onLoadMore?: () => void;
  /** Set false to hide the sentinel / stop observing. */
  hasMore?: boolean;
}

/**
 * Responsive masonry layout with **stable column assignment**.
 *
 * Uses JS-based distribution instead of CSS `columns` so that when a card
 * is removed, only items in that same column slide up — no cross-column
 * jumping.
 *
 * Column count: 2 (mobile) → 3 (tablet) → 4 (desktop) → 5 (wide).
 */
export default function MasonryGrid({
  children,
  onLoadMore,
  hasMore = false,
}: MasonryGridProps) {
  const columnCount = useColumnCount();
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ── Stable column assignments ──
     Once an item is placed in a column, it stays there even when
     other items are removed. Resets only on column-count change
     (responsive resize). */
  const assignmentsRef = useRef<Map<string, number>>(new Map());
  const counterRef = useRef(0);
  const prevColsRef = useRef(columnCount);

  if (prevColsRef.current !== columnCount) {
    assignmentsRef.current.clear();
    counterRef.current = 0;
    prevColsRef.current = columnCount;
  }

  const childArray = Children.toArray(children);
  const columns: ReactNode[][] = Array.from(
    { length: columnCount },
    () => [],
  );

  childArray.forEach((child) => {
    const key = String((child as ReactElement).key ?? "");

    if (!assignmentsRef.current.has(key)) {
      assignmentsRef.current.set(key, counterRef.current % columnCount);
      counterRef.current++;
    }

    const col = assignmentsRef.current.get(key)!;
    columns[col].push(child);
  });

  /* ── Infinite-scroll sentinel ── */
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !onLoadMore) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) onLoadMore();
        },
        { rootMargin: "200px" },
      );
      observerRef.current.observe(node);
    },
    [onLoadMore],
  );

  return (
    <div className="px-3 py-4">
      <div className="flex items-start gap-3">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-1 flex-col">
            {col}
          </div>
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}
    </div>
  );
}
