"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./NavIcons";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-light-brown/20 fixed right-0 bottom-0 left-0 z-50 lg:hidden flex items-center justify-around border-t bg-dark-brown/90 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
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
