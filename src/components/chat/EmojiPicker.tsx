import React from 'react'
import Picker from "@emoji-mart/react";
import data from '@emoji-mart/data'
import { useTheme } from "next-themes";
import { Smile } from "lucide-react";

import { Popover,
  PopoverTrigger,
  PopoverContent
 } from "@/components/ui/popover";

function EmojiPicker({onChange}:{onChange:(value:string) => void}) {

  const {resolvedTheme}  = useTheme();

  return (
    <Popover>
      <PopoverTrigger className="">
        <Smile className="size-6 bg-zinc-800 rounded-full" />
      </PopoverTrigger>
      <PopoverContent
      sideOffset={90}
      side="right"
      className="bg-transparent border-none drop-shadow-none shadow-none"
      >
        <Picker 
        themes={resolvedTheme}
        data={data}
        onEmojiSelect={(emoji:any) => onChange(emoji.native)}
        className="bg-transparent border-none"
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker