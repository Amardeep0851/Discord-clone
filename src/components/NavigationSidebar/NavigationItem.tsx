"use client"
import React from 'react'
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";

type NavigationItemProps = {
  name:string;
  serverId:string;
  imageUrl:string
}
function NavigationItem({name, serverId, imageUrl}:NavigationItemProps) {
  const router = useRouter();
  const params = useParams();

  const onClick = () => {
  return router.push(`/servers/${serverId}`)
  }

  return (
    <ActionTooltip label={name} align="center" side="right">      
    <div className="flex flex-col items-center">
    <button className="group relative my-2 hover:shadow-md rounded-[24px] hover:shadow-zinc-700" onClick={onClick}>
    <div className={cn("w-[4px] absolute left-0 bg-primary rounded-full transition-all ",
      params?.serverId !== serverId && "group-hover:h-[20px] z-10 duration-1000",
      params?.serverId === serverId ? "h-[48px] z-50" : "h-[4px]"
    )} />
    <div className="relative group w-[48px] h-[48px] rounded-[16px] transition-all overflow-hidden ">
    <Image src={imageUrl} alt={name} fill />
    </div>
    </button>
    </div>
    </ActionTooltip>
  )
}

export default NavigationItem