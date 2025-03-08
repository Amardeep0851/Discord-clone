import React from 'react'
import { redirect } from "next/navigation"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { db } from "@/config/db"

import { currentUserProfile } from "@/config/currentProfile"
import { ModeToggle } from "../mode-toggle"
import { UserButton } from "@clerk/nextjs"
import NavigationItem from "./NavigationItem"
import NavigationAction from "./NavigationAction"

async function NavigationSidebar() {
  const profile = await currentUserProfile();
  
  if(!profile){
    return redirect("/")
  }
  const servers = await db.server.findMany({
    where:{
      members:{
        some:{
          profileId:profile.id
        }
      }
    }
  })
  return (
    <div className="py-4 border-r-[1px] flex flex-col dark:bg-[#1e1f22] bg-[#e3e5e8] space-y-4 h-full">
      <NavigationAction />
      <Separator className="h-[2px] rounded-md bg-zinc-700 w-[48px] mx-auto" />
      <ScrollArea className="flex-1">
        {servers.map((server) => (
          <div key={server.id} >
            <NavigationItem 
          name={server.name}
          serverId={server.id}
          imageUrl={server.imageUrl}
          />
          </div>
        ))}
        
      </ScrollArea>
      <Separator className="h-[3px] w-[48px] rounded-md bg-zinc-700  mx-auto" />
      
      <div className="flex flex-col items-center ">
      <ModeToggle />
      <UserButton appearance={{elements:{
        avatarBox:"h-[48px] w-[48px]"
      }}} />
      </div>
    </div>
  )
}

export default NavigationSidebar