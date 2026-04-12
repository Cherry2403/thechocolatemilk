"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";
import type { FeedItem } from "@/lib/types/feed";

interface FeedCardProps {
  item: FeedItem;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

/**
 * A single feed card — image only, with X (dismiss) and ♡ (like) overlays.
 *
 * Two-phase exit animation:
 *   Phase 1 — card fades out + slight scale + upward drift  (220 ms)
 *   Phase 2 — wrapper height + margin collapse smoothly      (320 ms)
 *
 * This keeps cards in the same column and creates a natural "slide up" feel.
 */
export default function FeedCard({ item, onLike, onDislike }: FeedCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pendingAction = useRef<"like" | "dislike">("like");
  const isAnimating = useRef(false);

  const handleAction = useCallback(
    (action: "like" | "dislike") => {
      if (isAnimating.current) return; // guard against rapid double-click
      isAnimating.current = true;
      pendingAction.current = action;
      const el = wrapperRef.current;
      if (!el) return;

      // ── Phase 1: Freeze height, fade out + scale + drift up ──
      el.style.height = `${el.offsetHeight}px`;
      el.style.overflow = "hidden";
      el.style.transition = "opacity 220ms ease-out, transform 220ms ease-out";

      requestAnimationFrame(() => {
        el.style.opacity = "0";
        el.style.transform = "scale(0.96) translateY(-8px)";
      });

      // ── Phase 2: Collapse height + margin (smooth slide-up) ──
      setTimeout(() => {
        el.style.transition =
          "height 320ms cubic-bezier(0.22, 0.68, 0.35, 1), margin-bottom 320ms cubic-bezier(0.22, 0.68, 0.35, 1)";
        el.style.height = "0px";
        el.style.marginBottom = "0px";
      }, 220);

      // ── Phase 3: Remove from state ──
      setTimeout(() => {
        if (pendingAction.current === "like") onLike(item.id);
        else onDislike(item.id);
      }, 560);
    },
    [item.id, onLike, onDislike]
  );

  return (
    <div ref={wrapperRef} className="mb-3">
      <div className="group bg-surface relative overflow-hidden rounded-[5px] shadow-sm">
        {/* Image — natural aspect ratio, fills column width */}
        <Image
          src={item.image}
          alt={item.name}
          width={400}
          height={0}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-auto w-full object-cover"
        />

        {/* Gradient overlay + action buttons */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-14 from-black/25 to-transparent pt-3 pb-3 opacity-100 transition-opacity duration-200 max-md:opacity-100">
          {/* Dismiss (X) */}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => handleAction("dislike")}
            className="bg-dark-brown/70 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-transform duration-150 active:scale-90"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              stroke="var(--color-white)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Like (♡) */}
          <button
            type="button"
            aria-label="Like"
            onClick={() => handleAction("like")}
            className="bg-dark-red/60 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-transform duration-150 active:scale-90"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-white)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
