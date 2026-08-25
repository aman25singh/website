/** Human-readable date, e.g. "August 24, 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Machine date for <time datetime>, e.g. "2026-08-24". */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
