import { useEffect } from "react"
import { Outlet, useLocation, useMatch } from "react-router"

import { SiteHeader } from "@/components/site-header"
import { getEntry, getSection } from "@/content"
import { site } from "@/content/site"
import { DetailPane } from "@/layouts/detail-pane"
import { cn } from "@/lib/utils"

/**
 * One render tree at every width. The only responsive behavior is two class
 * toggles driven by `isDetailOpen`, which comes from the URL rather than the
 * viewport — above `lg` the panes sit side by side, below it whichever pane
 * is relevant fills the page.
 */
export function SiteLayout() {
  const detailMatch = useMatch("/:sectionId/:slug")
  const sectionMatch = useMatch("/:sectionId")
  const isDetailOpen = detailMatch !== null
  const { pathname } = useLocation()

  // Assigned directly rather than via a rendered <title>, which React 19 would
  // hoist alongside the static one in index.html instead of replacing it.
  useEffect(() => {
    const sectionId = (detailMatch ?? sectionMatch)?.params.sectionId
    const slug = detailMatch?.params.slug
    const page = slug
      ? (getEntry(sectionId, slug)?.title ?? "Not Found")
      : sectionId
        ? (getSection(sectionId)?.label ?? "Not Found")
        : pathname === "/"
          ? undefined
          : "Not Found"

    document.title = page ? `${site.name} - ${page}` : site.name
  }, [detailMatch, sectionMatch, pathname])

  // Mobile scrolls the window; desktop panes scroll themselves, so this is a
  // no-op there.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-svh lg:flex lg:h-svh lg:overflow-hidden">
      <div
        className={cn(
          "scrollbar-hide",
          "w-full px-6 py-10 lg:h-svh lg:w-[600px] lg:shrink-0 lg:overflow-y-auto lg:px-12 lg:py-14",
          isDetailOpen && "max-lg:hidden"
        )}
      >
        <SiteHeader />
        <Outlet />
      </div>

      {/* The vertical rule rides on this element, so closing the pane removes
          the rule and the empty column together. */}
      <div
        className={cn(
          "flex-1 lg:h-svh lg:border-l lg:border-border"
          // !isDetailOpen && "hidden" // TODO window seperator
        )}
      >
        <DetailPane />
      </div>
    </div>
  )
}
