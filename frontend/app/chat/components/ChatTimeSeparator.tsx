interface ChatTimeSeparatorProps {
  label: string;
}

/**
 * Messenger-style time separator displayed between message groups.
 *
 * Centered text with subtle styling, shown when there's a gap
 * of 5+ minutes between consecutive messages.
 *
 * Format rules:
 * - Today:      "09:31"
 * - This week:  "09:39 Thursday"
 * - Older:      "03:40 3rd March 2026"
 */
export default function ChatTimeSeparator({ label }: ChatTimeSeparatorProps) {
  return (
    <div className="my-4 flex items-center justify-center">
      <span className="text-[11px] text-grey/40">{label}</span>
    </div>
  );
}
