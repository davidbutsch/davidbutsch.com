import type * as React from "react"

import { cn } from "@/lib/utils"

export function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tag"
      className={cn(
        "border border-border px-2 py-0.5 text-xs hard-shadow-sm",
        className
      )}
      {...props}
    />
  )
}
