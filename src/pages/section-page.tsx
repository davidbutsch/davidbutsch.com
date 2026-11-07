import { useParams } from "react-router"

import { TimelineSection } from "@/components/timeline-section"
import { getSection } from "@/content"
import { NotFoundPage } from "@/pages/not-found-page"

export function SectionPage() {
  // Correct here (unlike in the layout) — this component *is* the element of
  // the route that declares these params.
  const { sectionId, slug } = useParams()
  const section = getSection(sectionId)

  if (!section) return <NotFoundPage />

  return <TimelineSection section={section} activeSlug={slug} />
}
