import matter from "gray-matter"
import { basename } from "node:path"
import rehypeKatex from "rehype-katex"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import type { Plugin } from "vite"

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex, { strict: "warn" })
  .use(rehypeStringify, { allowDangerousHtml: true })

/**
 * YAML turns `2023` into a number and `2023-04-15` into a Date, while
 * `2023-04` stays a string. Normalize all three back to a partial ISO string
 * instead of relying on authors remembering to quote.
 */
function coerceDate(value: unknown): string | undefined {
  if (value == null) return undefined
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "number") return String(value)
  if (typeof value === "string") return value
  return undefined
}

function fail(file: string, message: string): never {
  throw new Error(`[markdown-content] ${basename(file)}: ${message}`)
}

function normalizeFrontmatter(data: Record<string, unknown>, file: string) {
  const title = data.title
  const blurb = data.blurb
  const start = coerceDate(data.start)
  const end = coerceDate(data.end)

  if (typeof title !== "string" || title.length === 0) {
    fail(file, "frontmatter `title` is required")
  }
  if (typeof blurb !== "string" || blurb.length === 0) {
    fail(file, "frontmatter `blurb` is required")
  }
  if (!start) fail(file, "frontmatter `start` is required")

  const links = data.links
  if (links != null) {
    if (!Array.isArray(links)) fail(file, "`links` must be a list")
    for (const link of links) {
      if (typeof link?.label !== "string" || typeof link?.href !== "string") {
        fail(file, "each `links` entry needs a `label` and an `href`")
      }
    }
  }

  const tags = data.tags
  if (tags != null && !Array.isArray(tags)) fail(file, "`tags` must be a list")

  return {
    slug: typeof data.slug === "string" ? data.slug : basename(file, ".md"),
    title,
    subtitle: typeof data.subtitle === "string" ? data.subtitle : undefined,
    start,
    end,
    blurb,
    tags: tags as string[] | undefined,
    links: links as { label: string; href: string }[] | undefined,
  }
}

/**
 * Turns each `.md` file into a module whose default export is a TimelineEntry:
 * frontmatter fields plus `html` prerendered at build time. KaTeX is typeset
 * here via rehype-katex, so no markdown or math code reaches the browser.
 */
export function markdownContent(): Plugin {
  return {
    name: "markdown-content",
    enforce: "pre",
    async transform(code, id) {
      if (!id.endsWith(".md")) return null

      const { data, content } = matter(code)
      if (content.trim().length === 0) {
        fail(id, "a markdown body is required — every entry needs content")
      }
      const entry = normalizeFrontmatter(data, id)

      const file = await processor.process(content)
      if (file.messages.length > 0) {
        fail(id, file.messages.map((message) => message.reason).join("; "))
      }
      const html = String(file)

      return {
        code: `export default ${JSON.stringify({ ...entry, html })}`,
        map: null,
      }
    },
  }
}
