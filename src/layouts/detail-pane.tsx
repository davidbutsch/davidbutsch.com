import { Link, useMatch } from "react-router"

import { EntryDetail } from "@/components/entry-detail"
import { getEntry, getSection } from "@/content"

/**
 * Rendered by SiteLayout, which is a pathless layout route — `useParams`
 * there resolves against that route's own (empty) match, so `:slug` would
 * come back undefined. `useMatch` reads the full location instead.
 */
export function DetailPane() {
  const match = useMatch("/:sectionId/:slug")
  if (!match) return null

  const { sectionId, slug } = match.params
  const section = getSection(sectionId)
  const entry = getEntry(sectionId, slug)
  const closeTo = section ? `/${section.path}` : "/"

  return (
    // Keyed per entry so the scroll container remounts and scrollTop resets.
    <div
      key={`${sectionId}/${slug}`}
      className="animate-in px-6 py-10 duration-200 fade-in lg:h-svh lg:overflow-y-auto lg:px-12 lg:py-14"
    >
      <div className="mb-8 flex items-start justify-between gap-4 text-xs">
        <Link to="/" className="underline-offset-4 hover:underline lg:hidden">
          &larr; Home
        </Link>
        <span className="hidden tracking-wider text-muted-foreground uppercase lg:inline">
          {section ? `${section.label}` : "Not Found"}
        </span>
        {/* A real navigation to the parent section, not history.back(), so it
            still works when the detail was opened from a cold deep link. */}
        <Link
          to={closeTo}
          className="hidden underline-offset-4 hover:underline lg:inline"
        >
          Close
        </Link>
      </div>

      {entry ? (
        <EntryDetail entry={entry} />
      ) : (
        <p className="text-sm text-muted-foreground">
          No entry found for that link.
        </p>
      )}
    </div>
  )
}
