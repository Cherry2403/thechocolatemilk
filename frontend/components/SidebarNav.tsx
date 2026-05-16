"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { NAV_ITEMS } from "./NavIcons";

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex flex-col w-20 bg-dark-brown border-r border-light-brown/20 fixed h-full px-3 py-8 z-40 items-center">
      {/* Logo — rotated vertically */}
      <div className="mb-8 flex justify-center">
        <Logo size="sm" rotated className="text-cream" />
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-8">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center transition ${
                isActive
                  ? "text-light-brown"
                  : "text-cream hover:text-light-brown"
              }`}
              aria-label={label}
            >
              <Icon active={isActive} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
