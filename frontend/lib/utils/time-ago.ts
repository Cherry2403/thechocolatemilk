const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

/**
 * Convert an ISO date string to a human-friendly relative time.
 * Used in contact list sidebar (lightweight, no re-render needed).
 * e.g. "2m ago", "3h ago"
 */
export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  if (seconds < 0) return "just now";
  if (seconds < MINUTE) return "just now";
  if (seconds < HOUR) {
    const m = Math.floor(seconds / MINUTE);
    return `${m}m ago`;
  }
  if (seconds < DAY) {
    const h = Math.floor(seconds / HOUR);
    return `${h}h ago`;
  }
  if (seconds < WEEK) {
    const d = Math.floor(seconds / DAY);
    return `${d}d ago`;
  }
  if (seconds < MONTH) {
    const w = Math.floor(seconds / WEEK);
    return `${w}w ago`;
  }
  if (seconds < YEAR) {
    const mo = Math.floor(seconds / MONTH);
    return `${mo}mo ago`;
  }

  const y = Math.floor(seconds / YEAR);
  return `${y}y ago`;
}

/* ─── Day names for "this week" format ─── */
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Ordinal suffix for day numbers: 1st, 2nd, 3rd, 4th… */
function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Pad a number to 2 digits: 9 → "09" */
function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Format a chat timestamp for display as a Messenger-style separator.
 *
 * Rules (computed once, not relative — no re-render cost):
 * - **Today:**      "09:31"
 * - **This week:**  "09:39 Thursday"
 * - **Older:**      "03:40 3rd March 2026"
 */
export function formatChatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const time = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;

  // Check if same calendar day
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) return time;

  // Check if within the last 7 calendar days
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor(
    (startOfToday.getTime() -
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
      (1000 * DAY)
  );

  if (diffDays > 0 && diffDays < 7) {
    return `${time} ${DAYS[date.getDay()]}`;
  }

  // Older than a week
  return `${time} ${ordinal(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Minimum gap (in minutes) between messages before showing a time separator.
 * Matches Messenger behavior — only show when there's a pause in conversation.
 */
export const CHAT_TIME_GAP_MINUTES = 5;

/**
 * Determine whether a time separator should appear between two messages.
 * Returns the formatted timestamp string, or null if no separator needed.
 */
export function shouldShowTimeSeparator(
  prevTimestamp: string | null,
  currentTimestamp: string
): string | null {
  if (!prevTimestamp) return formatChatTime(currentTimestamp);

  const gap =
    (new Date(currentTimestamp).getTime() - new Date(prevTimestamp).getTime()) / 1000 / 60;

  if (gap >= CHAT_TIME_GAP_MINUTES) {
    return formatChatTime(currentTimestamp);
  }
  return null;
}
