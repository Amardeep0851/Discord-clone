import { Hash } from "lucide-react";
import React from 'react'

interface ChatWelcomeMessageProps{
  type:"channel"|"conversation";
  name:string
}

function ChatWelcomeMessage({type, name}:ChatWelcomeMessageProps) {
  return (
    <div className=" space-y-2 mb-3">
      {type === "channel" && <div className="dark:bg-zinc-500 bg-zinc-300 h-[74px] w-[74px] rounded-full flex justify-center items-center">
        <Hash className="size-16 dark:text-zinc-200 text-zinc-700" />
      </div>}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? `Welcome to #${name}` : `${name}`}
      </p>
      <p className="text-sm ">
        {
        type === "channel" 
        ? `This is the start of the #${name} channel`
        : `This is the start of your converstaion with ${name}`
        }
      </p>
    </div>
  )
}

export default ChatWelcomeMessage