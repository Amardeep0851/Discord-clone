import React from 'react'
import { redirect } from "next/navigation";


import { ChannelType, MemberRole } from "@prisma/client";
import { db } from "@/config/db";
import { currentUserProfile } from "@/config/currentProfile";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import ServerHeader from "./ServerHeader";
import ServerSearch from "./ServerSearch";
import ServerSection from "./ServerSection";
import ServerChannels from "./ServerChannels";
import ServerMembers from "./ServerMembers";
import { Hash, Mic, Shield, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface serverSidebarProps{
  serverId:string
}

async function ServerSidebar({serverId}:serverSidebarProps) {
  const profile = await currentUserProfile();
  if(!profile) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where:{
      id:serverId,
    },
    include:{
      members:{
        include:{
          profile:true
        },
        orderBy:{
          role:"asc"
        }
      },
      channels:{
        orderBy:{
          createdAt:"asc"
        }
      }
    }
  });
  if(!server) redirect("/")
  
  const textChannels = server.channels.filter((channels) => channels.type === ChannelType.TEXT);

  const audioChannels = server.channels.filter((channels) => channels.type === ChannelType.AUDIO);

  const videoChannels = server.channels.filter((channels) => channels.type === ChannelType.VIDEO);

  const members = server.members.filter((member) => member.profileId !== profile.id);
  const channelIconMap = {
    [ChannelType.TEXT]:<Hash className="size-4" />,
    [ChannelType.AUDIO]:<Mic className="size-4" />,
    [ChannelType.VIDEO]:<Video className="size-4" />,
  }
  const roleIconMap = {
    [MemberRole.GUEST]:<Shield className="size-4" />,
    [MemberRole.MODERATE]:<ShieldCheck className="size-4" />,
    [MemberRole.ADMIN]:<ShieldAlert className="size-4" />,
  }
  const role = server?.members?.find((member) => profile.id === member.profileId)?.role;
    
  return (
    <div
      className="py-4 pl-3 pr-3 space-y-3 
    flex flex-col
    dark:bg-zinc-800 bg-zinc-100 min-h-screen w-full"
    >
      <ServerHeader role={role} server={server} />
      <Separator className="bg-zinc-200 dark:bg-zinc-700" />
      <ServerSearch
        data={[
          {
            label: "Text Channels",
            type: "channel",
            data: textChannels?.map((channel) => ({
              id: channel.id,
              name: channel.name,
              icon: channelIconMap[channel.type],
            })),
          },
          {
            label: "Audio Channels",
            type: "channel",
            data: audioChannels?.map((channel) => ({
              id: channel.id,
              name: channel.name,
              icon: channelIconMap[channel.type],
            })),
          },
          {
            label: "Video Channels",
            type: "channel",
            data: videoChannels?.map((channel) => ({
              id: channel.id,
              name: channel.name,
              icon: channelIconMap[channel.type],
            })),
          },
          {
            label: "Members",
            type: "member",
            data: members?.map((member) => ({
              id: member.id,
              name: member.profile.name,
              icon: roleIconMap[member.role],
            })),
          },
        ]}
      />
      <Separator className="bg-zinc-200 dark:bg-zinc-700" />
      <ScrollArea className="flex-1 pr-3 pl-1 ">
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.TEXT}
              role={role}
              lable="Text Channels"
              server={server}
            />
            <div className="space-y-1 pt-2">
              {textChannels.map((channel) => (
                <ServerChannels
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.AUDIO}
              role={role}
              lable="Audio Channels"
              server={server}
            />
            <div className="space-y-1 pt-2 ">
              {audioChannels.map((channel) => (
                <ServerChannels
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
                
              ))}
            </div>
          </div>
        )}
        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.VIDEO}
              role={role}
              lable="Video Channels"
              server={server}
            />
            <div className="space-y-1 pt-2">
              {videoChannels.map((channel) => (
                <ServerChannels
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      <Separator className="bg-zinc-200 dark:bg-zinc-700" />

      {!!members?.length && (
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
          <ServerSection
            sectionType="member"
            channelType={ChannelType.VIDEO}
            role={role}
            lable={`Members list (${members.length})`}
            server={server}
          />
            <div className="space-y-2">
              {members.map((member) => (
                <ServerMembers 
                key={member.id}
                role={role}
                member={member}                
                />
                
              ))}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default ServerSidebar