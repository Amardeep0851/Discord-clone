"use client"
import React from 'react'
import { Plus } from "lucide-react"
import ActionTooltip from "@/components/ActionTooltip";
import { useModel } from "@/store/useModelStore";
function NavigationAction() {
  const {onOpen} = useModel();
  return (
    <div>
      <ActionTooltip label="Create new Channel" align="center" side="left">
        <div className="flex flex-col items-center">
        <button 
        className=" bg-zinc-800 dark:bg-zinc-500 hover:bg-zinc-700 dark:hover:bg-zinc-400 transition-all delay-300 rounded-md size-[48px] flex justify-center items-center "
        onClick={() => onOpen("createServer")}
        >
        <Plus className="w-8 h-8 text-primary-foreground" />
        </button>
        </div>
      </ActionTooltip>
    </div>
  )
}

export default NavigationAction