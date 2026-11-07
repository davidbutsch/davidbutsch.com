export type SectionId = "experience" | "education" | "projects"

export type EntryLink = {
  label: string
  href: string
}

/** One markdown file, as produced by the `markdown-content` Vite plugin. */
export type TimelineEntry = {
  /** Filename without extension, or a frontmatter override. */
  slug: string
  title: string
  /** Org / school / client. */
  subtitle?: string
  /** Partial ISO: "2024" | "2024-06" | "2024-06-15". */
  start: string
  /** Same shape, or "present". Omitted means a point in time. */
  end?: string
  /** One-line muted summary shown in the list. */
  blurb: string
  tags?: string[]
  links?: EntryLink[]
  /** Markdown body, prerendered to HTML at build time. Never empty. */
  html: string
}

export type Section = {
  id: SectionId
  /** Nav and heading text. */
  label: string
  /** URL segment; kept equal to `id`. */
  path: string
  /** Sorted newest first. */
  entries: TimelineEntry[]
}
