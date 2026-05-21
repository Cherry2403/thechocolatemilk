"use client";

import { useFeed } from "@/hooks/useFeed";
import MasonryGrid from "@/components/MasonryGrid";
import Logo from "@/components/Logo";
import FeedCard from "./components/FeedCard";

export default function FeedPage() {
  const { items, hasMore, loadMore, like, dislike } = useFeed();

  return (
    <>
      <div className="flex items-center justify-center px-4 pt-8 sm:px-6 sm:pt-10">
        <Logo size="lg" className="text-cream" />
      </div>
      <MasonryGrid onLoadMore={loadMore} hasMore={hasMore}>
        {items.map((item) => (
          <FeedCard key={item.id} item={item} onLike={like} onDislike={dislike} />
        ))}
      </MasonryGrid>
    </>
  );
}
