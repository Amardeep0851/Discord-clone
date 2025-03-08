
import React from 'react'
import { 
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
 } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";

type ActionTooltipProps = {
  children:React.ReactNode;
  label:string | null;
  align?: "center" | "start" | "end";
  side?: "top" | "bottom" | "left" | "right"
}

function ActionTooltip({children, label, align, side}: ActionTooltipProps) {
  return (
    <TooltipProvider >
      <Tooltip delayDuration={50} >
      <TooltipTrigger asChild>
      {children}
      </TooltipTrigger >
      <TooltipContent side={side} align={align} className="p-2 z-40 transition duration-300 ">
      <Button className="font-semibold text-md capitalize dark:bg-zinc-900 dark:text-zinc-100 bg-zinc-300 text-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-900">
      {label?.toLowerCase()}
      </Button>
      </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ActionTooltip