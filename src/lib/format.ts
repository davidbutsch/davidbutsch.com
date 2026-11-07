import type { TimelineEntry } from "@/content/types"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/**
 * "2024-06" -> "Jun 2024", "2024" -> "2024". Parsed by splitting rather than
 * with `new Date`, which shifts partial ISO dates across time zones.
 */
export function formatDate(value: string): string {
  const [year, month] = value.split("-")
  if (!month) return year
  const name = MONTHS[Number(month) - 1]
  return name ? `${name} ${year}` : year
}

export function formatDateRange(entry: {
  start: TimelineEntry["start"]
  end?: TimelineEntry["end"]
}): string {
  if (!entry.end) return formatDate(entry.start)
  const end = entry.end === "present" ? "Present" : formatDate(entry.end)
  return `${formatDate(entry.start)} — ${end}`
}
