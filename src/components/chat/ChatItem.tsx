import React from 'react'
import { UserAvatar } from "@/components/user-avatar";
import { ShieldAlert } from "lucide-react";

interface ChatItemProps{
  name:string;
  content:string;w
  fileUrl?:string | null;
  timestamp:string;
  deleted:boolean;
  isUpdated:boolean
}

function ChatItem({name, content, fileUrl, timestamp, deleted, isUpdated}:ChatItemProps) {
  return (
    <div className="flex flex-col w-full group hover:bg-black/5 rounded-md py-0.5 px-2 transition duration-200">
      <div className="flex flex-row">
        <div>
          <UserAvatar src="" />
        </div>
        <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <p className="font-bold text-lg">{name}</p> &nbsp; <ShieldAlert className="size-3" /> &nbsp; <span className="text-xs flex items-center text-zinc-300"> {timestamp}</span>
        </div>
        <p>content here</p>
        </div>
      </div>
      
    </div>
  )
}

export default ChatItem