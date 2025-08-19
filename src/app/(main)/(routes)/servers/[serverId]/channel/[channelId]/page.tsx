import React from 'react'
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


import { db } from "@/config/db";
import { currentUserProfile } from "@/config/currentProfile";

import ChatHeader from "@/components/chat/ChatHeader"
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

interface chatPageProps{
  params:Promise<{channelId:string, serverId:string}>
}

async function ChannelIdPage({params}:chatPageProps) {
  const profile = await currentUserProfile();
  if(!profile){return <RedirectToSignIn />}
  
  const {serverId, channelId} = await params;

  const channel = await db.channel.findUnique({
    where:{
      id:channelId,
      serverId:serverId
    }
  })
  const member = await db.member.findFirst({
    where:{
      serverId:serverId,
      profileId:profile.id
    }
  });
  if (!channel || !member) return redirect("/");
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader 
        name={channel?.name}
        serverId={serverId}
        type="channel"
      />

      <ChatMessages 
      type="channel"
      name={channel.name}
      chatId={channel.id}
      member={member}
      apiUrl="/api/messages"
      socketUrl="/api/socket/messages"
      socketQuery={{
        channelId:channel.id,
        serverId:serverId
      }}
      paramKey="channelId"
      paramValue={channel.id}
      />
      <ChatInput 
        name={channel.name}
        apiUrl="/api/socket/messages"
        query={{
          channelId:channel.id,
          serverId:serverId
        }}
        type="channel"
      />
    </div>
  )
}

export default ChannelIdPage