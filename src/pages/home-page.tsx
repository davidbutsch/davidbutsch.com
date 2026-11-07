import { TimelineSection } from "@/components/timeline-section"
import { sections } from "@/content"

export function HomePage() {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <TimelineSection key={section.id} section={section} />
      ))}
    </div>
  )
}
