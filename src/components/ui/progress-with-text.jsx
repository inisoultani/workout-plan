"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"


function ProgressBarWithText ({ className, value, textClassName, indicatorClassName, ...props }, ref)  {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-8 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-sm font-medium text-white", textClassName)}>
            {`${parseInt(100 - value) || 0}%`}
          </span>
        </div>
      </ProgressPrimitive.Root>
    )
  };
ProgressBarWithText.displayName = "ProgressBarWithText"

export { ProgressBarWithText }
