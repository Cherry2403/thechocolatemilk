"use client";

import { useFeed } from "@/hooks/useFeed";
import MasonryGrid from "@/components/MasonryGrid";
import FeedCard from "./components/FeedCard";

export default function FeedPage() {
  const { items, hasMore, loadMore, like, dislike } = useFeed();

  return (
    <MasonryGrid onLoadMore={loadMore} hasMore={hasMore}>
      {items.map((item) => (
        <FeedCard key={item.id} item={item} onLike={like} onDislike={dislike} />
      ))}
    </MasonryGrid>
  );
}
