import { useRender } from "@base-ui/react/use-render"
import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Vertical rail geometry lives in the `timeline*` utilities in index.css.
 * Items must sit flush against each other — put vertical rhythm in
 * TimelineItem's padding, never `space-y-*`/`gap-*` here, or the rail dashes.
 */
function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol data-slot="timeline" className={cn("timeline", className)} {...props} />
  )
}

function TimelineItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="timeline-item"
      className={cn("timeline-item pb-6 last:pb-0", className)}
      {...props}
    />
  )
}

function TimelineDot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="timeline-dot"
      className={cn("timeline-dot bg-foreground", className)}
      {...props}
    />
  )
}

type TimelineCardProps = useRender.ComponentProps<"div">

function TimelineCard({ className, render, ...props }: TimelineCardProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: {
      "data-slot": "timeline-card",
      className: cn(
        "block pressable cursor-pointer border border-border bg-card px-3 py-2 text-left hard-shadow-sm transition-all outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 data-[active]:bg-muted",
        className
      ),
      ...props,
    },
  })
}

function TimelineCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-card-header"
      className={cn("flex items-baseline justify-between gap-4", className)}
      {...props}
    />
  )
}

function TimelineCardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="timeline-card-title"
      className={cn("min-w-0 truncate text-sm font-medium", className)}
      {...props}
    />
  )
}

/** Right-aligned date sharing the title's baseline. */
function TimelineCardMeta({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timeline-card-meta"
      className={cn(
        "shrink-0 text-xs whitespace-nowrap text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TimelineCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-card-description"
      className={cn(
        "mt-1 line-clamp-2 text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineCard,
  TimelineCardDescription,
  TimelineCardHeader,
  TimelineCardMeta,
  TimelineCardTitle,
  TimelineDot,
  TimelineItem,
}
