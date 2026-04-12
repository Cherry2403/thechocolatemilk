"use client";

import { TasteProvider } from "@/contexts/TasteContext";
import type { ReactNode } from "react";

/**
 * Client-component wrapper that bundles all context providers.
 * Imported once in root layout.tsx so server components aren't affected.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return <TasteProvider>{children}</TasteProvider>;
}
