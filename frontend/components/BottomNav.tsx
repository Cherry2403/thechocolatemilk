"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

/* ── Inline SVG icons (Lucide-style, 24×24) ── */

function FeedIcon({ active }: { active: boolean }) {
  return (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="var(--color-dark-brown)"
        strokeWidth="1.8"
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
        fill="var(--color-dark-brown)"
        strokeWidth="1.8"
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
      fill="var(--color-dark-brown)"
      strokeWidth="1.8"
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
      fill="var(--color-dark-brown)"
      
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { href: "/feed", label: "Feed", icon: <FeedIcon active={false} /> },
  { href: "/chat", label: "Chat", icon: <ChatIcon active={false} /> },
  {
    href: "/connections",
    label: "Connections",
    icon: <ConnectionsIcon active={false} />,
  },
  { href: "/profile", label: "Profile", icon: <ProfileIcon active={false} /> },
];

const ICON_MAP: Record<string, (props: { active: boolean }) => React.ReactNode> = {
  "/feed": FeedIcon,
  "/chat": ChatIcon,
  "/connections": ConnectionsIcon,
  "/profile": ProfileIcon,
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/20 bg-white/30 pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = ICON_MAP[item.href];

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-4 py-3 transition-colors duration-200"
          >
            {Icon ? <Icon active={isActive} /> : item.icon}
            {/* <span
              className={`text-[10px] tracking-wider uppercase ${
                isActive
                  ? "font-medium text-yellow"
                  : "font-normal text-white/50"
              }`}
            >
              {item.label}
            </span> */}
          </Link>
        );
      })}
    </nav>
  );
}
