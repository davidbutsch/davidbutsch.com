import { Link } from "react-router"

import {
  TimelineCard,
  TimelineCardDescription,
  TimelineCardHeader,
  TimelineCardMeta,
  TimelineCardTitle,
  TimelineDot,
  TimelineItem,
} from "@/components/ui/timeline"
import type { SectionId, TimelineEntry } from "@/content"
import { entryPath } from "@/content"
import { formatDateRange } from "@/lib/format"

type TimelineEntryRowProps = {
  sectionId: SectionId
  entry: TimelineEntry
  active?: boolean
}

/**
 * Maps an entry onto the timeline primitives. Every entry has content, so
 * every row links to its detail route.
 */
export function TimelineEntryRow({
  sectionId,
  entry,
  active,
}: TimelineEntryRowProps) {
  return (
    <TimelineItem>
      <TimelineDot />
      <TimelineCard
        data-active={active ? "" : undefined}
        render={<Link to={entryPath(sectionId, entry.slug)} />}
      >
        <TimelineCardHeader>
          <TimelineCardTitle>{entry.title}</TimelineCardTitle>
          <TimelineCardMeta>{formatDateRange(entry)}</TimelineCardMeta>
        </TimelineCardHeader>
        <TimelineCardDescription>
          {entry.subtitle ? `${entry.subtitle} — ${entry.blurb}` : entry.blurb}
        </TimelineCardDescription>
      </TimelineCard>
    </TimelineItem>
  )
}
