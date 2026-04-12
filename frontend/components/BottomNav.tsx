"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Inline SVG icons (Lucide-style, 24×24) ──
   active  = filled dark-brown, no stroke
   inactive = no fill, stroked dark-brown */

function FeedIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? "var(--color-dark-brown)" : "none"}
      stroke="var(--color-dark-brown)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? "var(--color-dark-brown)" : "none"}
      stroke="var(--color-dark-brown)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ConnectionsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? "var(--color-dark-brown)" : "none"}
      stroke="var(--color-dark-brown)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? "var(--color-dark-brown)" : "none"}
      stroke="var(--color-dark-brown)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const NAV_ITEMS: {
  href: string;
  label: string;
  Icon: (p: { active: boolean }) => React.ReactNode;
}[] = [
  { href: "/feed", label: "Feed", Icon: FeedIcon },
  { href: "/chat", label: "Chat", Icon: ChatIcon },
  { href: "/connections", label: "Friends", Icon: ConnectionsIcon },
  { href: "/profile", label: "Profile", Icon: ProfileIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-light-brown/20 fixed right-0 bottom-0 left-0 z-50 flex items-center justify-around border-t bg-cream/50 pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const isActive = pathname.startsWith(href);

        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-4 py-3" aria-label={label}>
            <Icon active={isActive} />
          </Link>
        );
      })}
    </nav>
  );
}
