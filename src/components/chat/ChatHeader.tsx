import React from 'react'
import { UserAvatar } from "../user-avatar";
import MobileToggle from "../MobileToggle";
import { Hash } from "lucide-react";
import SocketIndicator from "./SocketIndicator";

interface chatHeaderProps{
  name:string;
  serverId:string;
  type:string;
  imageurl?:string
}

function ChatHeader({name, serverId, type, imageurl}: chatHeaderProps) {
  return (
    <div className="h-12 px-3 text-base font-semibold flex items-center w-full border-b-2 border-neutral-200 dark:border-neutral-800 sticky top-0 bg-zinc-800 z-50">
      
      <MobileToggle serverId={serverId} /> 
      
      
      {type === "channel" && <Hash className="size-5 text-zinc-500 dark:text-zinc-400" />}
      {type === "conversation" && (<UserAvatar src={imageurl} className="border-2 border-zinc-50 mr-2 md:size-9 size-9" />)}
      <p className="text-base font-semibold dark:text-white text-black">
        {name}
      </p>
      <div className="ml-auto">
        <SocketIndicator />
      </div>
    </div>
  )
}

export default ChatHeader