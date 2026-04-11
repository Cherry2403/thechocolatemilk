"use client";

import { useState } from "react";
import Image from "next/image";
import { useTaste } from "@/contexts/TasteContext";
import MasonryGrid from "@/app/feed/components/MasonryGrid";
import type { FeedItem } from "@/lib/types/feed";

type Tab = "liked" | "dismissed";

/* ── Profile card — tappable image that undoes the like/dislike ── */

function ProfileCard({
  item,
  onUndo,
}: {
  item: FeedItem;
  onUndo: (id: string) => void;
}) {
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => onUndo(item.id)}
        className="group relative w-full overflow-hidden rounded-[5px] bg-white shadow-sm transition-transform duration-150 active:scale-[0.98]"
      >
        <Image
          src={item.image}
          alt={item.name}
          width={400}
          height={0}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-auto w-full object-cover"
        />

        {/* Subtle undo hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/10">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-dark-brown opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
            Undo
          </span>
        </div>
      </button>
    </div>
  );
}

/* ── Taste Timeline — two tabs: liked / dismissed ── */

export default function TasteTimeline() {
  const [tab, setTab] = useState<Tab>("liked");
  const { likedItems, dislikedItems, removeLike, removeDislike } = useTaste();

  const items = tab === "liked" ? likedItems : dislikedItems;
  const onUndo = tab === "liked" ? removeLike : removeDislike;

  return (
    <div>
      {/* ── Tab switcher (Instagram-style) ── */}
      <div className="flex border-b border-light-brown/20">
        <button
          type="button"
          onClick={() => setTab("liked")}
          className={`flex-1 py-3 text-center text-xs uppercase tracking-widest transition-colors ${
            tab === "liked"
              ? "border-b-2 border-dark-brown font-medium text-dark-brown"
              : "text-grey/50"
          }`}
        >
          Liked
        </button>
        <button
          type="button"
          onClick={() => setTab("dismissed")}
          className={`flex-1 py-3 text-center text-xs uppercase tracking-widest transition-colors ${
            tab === "dismissed"
              ? "border-b-2 border-dark-brown font-medium text-dark-brown"
              : "text-grey/50"
          }`}
        >
          Dismissed
        </button>
      </div>

      {/* ── Grid or empty state ── */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm italic text-grey/50">
            {tab === "liked"
              ? "Heart items in your feed to see them here."
              : "Dismissed items will appear here."}
          </p>
        </div>
      ) : (
        <MasonryGrid>
          {items.map((item) => (
            <ProfileCard key={item.id} item={item} onUndo={onUndo} />
          ))}
        </MasonryGrid>
      )}
    </div>
  );
}
