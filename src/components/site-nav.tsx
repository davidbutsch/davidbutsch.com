import { NavLink } from "react-router"

import { sections } from "@/content"
import { cn } from "@/lib/utils"

const items = [
  // `end` keeps Home from matching every route; the section links
  // deliberately stay active on their own detail routes.
  { to: "/", label: "All", end: true },
  ...sections.map((section) => ({
    to: `/${section.path}`,
    label: section.label,
    end: false,
  })),
]

export function SiteNav() {
  // TODO remove the experience links and allat
  return (
    <nav className="mb-5 flex flex-wrap gap-5 text-sm md:mb-[default]">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "underline-offset-4 hover:underline",
              isActive && "underline decoration-2"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
