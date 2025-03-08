"use client"
import React from 'react'
import { ChannelType, MemberRole } from "@prisma/client"
import { Edit, Plus, Settings } from "lucide-react";

import { ServerWithMembersWithProfiles } from "@/config/typescript-types"
import ActionTooltip from "../ActionTooltip";
import { useModel } from "@/store/useModelStore";

interface ServerSectionProps {
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  role?: MemberRole;
  lable?: string;
  server: ServerWithMembersWithProfiles;
}

function ServerSection({sectionType, channelType, role, lable, server}:ServerSectionProps) { 

  const {onOpen} = useModel();
  return (
    <div className="flex justify-between items-center text-sm font-semibold text-zinc-700 dark:text-zinc-300 pr-1">      
      <span>{lable}</span>
      {sectionType === "channel" && role !== MemberRole.GUEST && (
        <ActionTooltip label="Create Channel" side="top">
        <Plus className="size-4 font-bold cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-all" onClick={() => onOpen("createChannel", {server, channelType})}  />
        </ActionTooltip>
      )}
      {sectionType === "member" && role === MemberRole.ADMIN && (
        <ActionTooltip label="Manager members">
        <Settings className="size-4 font-bold cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-all" onClick={() => onOpen("managerMember", {server})}  />
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerSection