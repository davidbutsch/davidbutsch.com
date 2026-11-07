import { TimelineEntryRow } from "@/components/timeline-entry-row"
import { Timeline } from "@/components/ui/timeline"
import type { Section } from "@/content"

type TimelineSectionProps = {
  section: Section
  /** Slug of the entry currently open in the detail pane. */
  activeSlug?: string
}

export function TimelineSection({ section, activeSlug }: TimelineSectionProps) {
  return (
    <section aria-labelledby={`${section.id}-heading`}>
      <h2
        id={`${section.id}-heading`}
        className="mb-4 font-serif text-lg font-bold"
      >
        {section.label}
      </h2>
      <Timeline>
        {section.entries.map((entry) => (
          <TimelineEntryRow
            key={entry.slug}
            sectionId={section.id}
            entry={entry}
            active={entry.slug === activeSlug}
          />
        ))}
      </Timeline>
    </section>
  )
}
