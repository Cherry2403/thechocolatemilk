"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating feedback widget — like/dislike + optional written feedback.
 *
 * Delivery: POSTs to Formspree. Set NEXT_PUBLIC_FORMSPREE_ID in .env.local
 * to your form ID (e.g. "xyzabcde"). If unset, submissions log to console
 * so the UI still works locally without configuration.
 */

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Vote = "like" | "dislike";
type Status = "idle" | "submitting" | "success" | "error";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState<Vote | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* ── Close on Escape, close on outside click ── */
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  function reset() {
    setVote(null);
    setMessage("");
    setStatus("idle");
  }

  async function submit() {
    if (!vote) return;
    setStatus("submitting");

    const payload = {
      vote,
      message: message.trim(),
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      submittedAt: new Date().toISOString(),
    };

    try {
      if (FORMSPREE_ID) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Formspree ${res.status}`);
      } else {
        console.info("[FeedbackWidget] (no NEXT_PUBLIC_FORMSPREE_ID set) Would submit:", payload);
      }
      setStatus("success");
    } catch (err) {
      console.error("[FeedbackWidget] submit failed", err);
      setStatus("error");
    }
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) reset();
        }}
        aria-label="Share feedback"
        aria-expanded={open}
        className="bg-cream text-dark-brown border-light-brown/40 fixed bottom-24 right-4 z-40 rounded-full border px-5 py-2.5 text-sm font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
      >
        Feedback
      </button>

      {/* ── Panel ── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="feedback-title"
          className="fixed bottom-40 right-4 z-40 w-[calc(100vw-2rem)] max-w-xs rounded-2xl bg-cream text-text shadow-xl sm:bottom-24 sm:right-6 sm:max-w-sm"
        >
          {/* Header */}
          <div className="border-light-brown/20 flex items-center justify-between border-b px-5 py-3">
            <h2 id="feedback-title" className="text-sm font-semibold tracking-wide">
              How was your visit?
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-grey hover:text-text -mr-1 p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            {status === "success" ? (
              <div className="text-center">
                <p className="text-sm">Got it — thank you for the feedback.</p>
                <button
                  type="button"
                  onClick={reset}
                  className="text-dark-brown hover:text-dark-brown/70 mt-3 text-xs underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                {/* Vote buttons */}
                <div className="mb-3 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setVote("like")}
                    aria-pressed={vote === "like"}
                    aria-label="I liked it"
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all ${
                      vote === "like"
                        ? "bg-green text-cream scale-110 shadow-md"
                        : "bg-light-brown/15 text-dark-brown hover:bg-light-brown/25"
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={vote === "like" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 10v12" />
                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l5-9a3 3 0 0 1 3 3v2.88Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVote("dislike")}
                    aria-pressed={vote === "dislike"}
                    aria-label="I didn't like it"
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all ${
                      vote === "dislike"
                        ? "bg-dark-red text-cream scale-110 shadow-md"
                        : "bg-light-brown/15 text-dark-brown hover:bg-light-brown/25"
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={vote === "dislike" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17 14V2" />
                      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-5 9a3 3 0 0 1-3-3v-1.88Z" />
                    </svg>
                  </button>
                </div>

                {/* Message field */}
                <label htmlFor="feedback-message" className="sr-only">
                  Optional feedback message
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    vote === "dislike"
                      ? "What could be better? (optional)"
                      : "Anything you'd like to share? (optional)"
                  }
                  rows={3}
                  maxLength={500}
                  className="border-light-brown/30 placeholder:text-grey/60 w-full resize-none rounded-lg border bg-white/70 px-3 py-2 text-sm outline-none focus:border-dark-brown/50"
                />

                {status === "error" && (
                  <p className="text-dark-red mt-2 text-xs">
                    Couldn&apos;t send — please try again.
                  </p>
                )}

                <button
                  type="button"
                  onClick={submit}
                  disabled={!vote || status === "submitting"}
                  className="bg-dark-brown text-cream hover:bg-dark-brown/90 mt-3 w-full rounded-lg py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === "submitting" ? "Sending…" : "Send"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
