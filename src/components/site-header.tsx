import { SiteNav } from "@/components/site-nav"
import { SnakeGame } from "@/components/snake-game"
import { site } from "@/content/site"

export function SiteHeader() {
  return (
    <header className="mb-10">
      <h1 className="sr-only">{site.name}</h1>
      <SiteNav />
      <SnakeGame />

      {site.links.length > 0 && (
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {site.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-4"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
