import { ArrowUpRight } from "lucide-react"

import { Tag } from "@/components/tag"
import type { TimelineEntry } from "@/content"
import { formatDateRange } from "@/lib/format"

/**
 * Renders the markdown body that the Vite plugin prerendered at build time.
 *
 * `dangerouslySetInnerHTML` is safe here by construction: the HTML is
 * generated from first-party files in this repo, never from user input, so
 * nothing untrusted can reach it. If the pipeline ever ingests external
 * markdown, add `rehype-sanitize` to the processor in the plugin.
 */
export function EntryDetail({ entry }: { entry: TimelineEntry }) {
  return (
    <article>
      <header>
        <h1 className="font-serif text-2xl font-bold">{entry.title}</h1>
        {entry.subtitle && <p className="mt-1 text-sm">{entry.subtitle}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDateRange(entry)}
        </p>
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose-entry mt-8"
        dangerouslySetInnerHTML={{ __html: entry.html }}
      />

      {entry.links && entry.links.length > 0 && (
        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm">
          {entry.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          ))}
        </nav>
      )}
    </article>
  )
}
