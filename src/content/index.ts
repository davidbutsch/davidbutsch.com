import { sectionMeta } from "./sections"
import type { Section, SectionId, TimelineEntry } from "./types"

type EntryModule = { default: TimelineEntry }

/**
 * Eager so entry HTML is inlined into the bundle — the list needs the
 * frontmatter anyway, and detail panes open with no fetch. If the prose ever
 * outgrows that, dropping `eager` here plus a Suspense boundary in the detail
 * pane is the whole change.
 */
const files: Record<SectionId, Record<string, EntryModule>> = {
  experience: import.meta.glob<EntryModule>("./experience/*.md", {
    eager: true,
  }),
  education: import.meta.glob<EntryModule>("./education/*.md", { eager: true }),
  projects: import.meta.glob<EntryModule>("./projects/*.md", { eager: true }),
  blog: import.meta.glob<EntryModule>("./blog/*.md", { eager: true }),
}

export const sections: Section[] = sectionMeta.map((meta) => ({
  ...meta,
  entries: Object.values(files[meta.id])
    .map((module) => module.default)
    // Partial ISO strings sort lexically, so this is newest-first without
    // ever constructing a Date.
    .sort((a, b) => b.start.localeCompare(a.start)),
}))

const byPath = new Map(sections.map((section) => [section.path, section]))

export function getSection(path: string | undefined): Section | undefined {
  return path ? byPath.get(path) : undefined
}

export function getEntry(
  path: string | undefined,
  slug: string | undefined
): TimelineEntry | undefined {
  if (!slug) return undefined
  return getSection(path)?.entries.find((entry) => entry.slug === slug)
}

/** The one place that knows the detail-route URL shape. */
export function entryPath(sectionId: SectionId, slug: string): string {
  return `/${sectionId}/${slug}`
}

export type { EntryLink, Section, SectionId, TimelineEntry } from "./types"
