"use client"

import React from 'react';
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Trash, Hash, Mic, Video, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import ActionTooltip from "../ActionTooltip";
import { ModelType, useModel } from "@/store/useModelStore";
import { ServerWithMembersWithProfiles } from "@/config/typescript-types";

interface ServerChannelsProps {
  channel: Channel;
  role?:MemberRole;
  server:ServerWithMembersWithProfiles;
}

function ServerChannels({channel, role, server, }:ServerChannelsProps) {
    const channelIconMap = {
      [ChannelType.TEXT]:Hash,
      [ChannelType.AUDIO]:Mic,
      [ChannelType.VIDEO]:Video
    }
    const {onOpen} = useModel();
    const Icon = channelIconMap[channel.type]
    const router = useRouter();
    const params = useParams();


    const changeRoute = (channeld:string) => {
      router.push(`/servers/${server.id}/channel/${channel.id}`)
    }

    const onAction = (e:React.MouseEvent, action:ModelType) => {
      onOpen(action, {server, channel})
    }
  return (
    <div className={cn(" group flex justify-between pl-2 py-2 w-full items-center text-sm font-semibold rounded transition-all text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700/60 hover:bg-zinc-200/50 cursor-pointer", params.channelId === channel.id && "dark:bg-zinc-700/80 bg-zinc-200")}
    onClick={() => changeRoute(channel.id)}
    >
      <button className="flex w-full ">
      {<Icon className="size-4 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />} <span className="pl-1 ">{channel.name}</span>
      </button>
      {role !== MemberRole.GUEST && channel.name !== "general"  && (
        <div className="pr-1 flex gap-2 ">
          <ActionTooltip label="Edit">
          <Edit className="hidden group-hover:block size-4 cursor-pointer transition-all "
          onClick={(e) => onAction(e, "editChannel")}
          />
        </ActionTooltip>
        <ActionTooltip label="Delete">
        <Trash className="hidden group-hover:block size-4 cursor-pointer transition-all" 
        onClick={(e) => onAction(e, "deleteChannel")}
        />
      </ActionTooltip>
        </div>
      )}
      {channel.name === "general"&& (
        <Lock className="size-4 text-zinc-500 dark:text-zinc-400 pr-1 hidden group-hover:block" />
      )}
    </div>
  )
}

export default ServerChannels