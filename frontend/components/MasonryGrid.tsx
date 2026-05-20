"use client";

import { useCallback, useRef } from "react";

interface MasonryGridProps {
  children: React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function MasonryGrid({ children, onLoadMore, hasMore = false }: MasonryGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !onLoadMore) return;
      observerRef.current = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
        { rootMargin: "200px" }
      );
      observerRef.current.observe(node);
    },
    [onLoadMore]
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="columns-2 sm:columns-4 md:columns-5 gap-4 sm:gap-5">
        {children}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="border-cream h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
