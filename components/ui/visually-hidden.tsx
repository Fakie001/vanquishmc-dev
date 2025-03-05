import { cn } from "@/lib/utils"
import type React from "react"

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const VisuallyHidden = ({ className, ...props }: VisuallyHiddenProps) => {
  return (
    <span
      className={cn(
        "absolute h-1 w-1 overflow-hidden whitespace-nowrap p-0",
        "clip-[rect(0px,0px,0px,0px)] [clip-path:inset(100%)]",
        className,
      )}
      {...props}
    />
  )
}

