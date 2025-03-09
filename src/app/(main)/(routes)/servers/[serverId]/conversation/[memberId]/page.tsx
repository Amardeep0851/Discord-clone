import React from 'react'

import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/config/db";
import getOrCreateConverstaion from "@/config/converstaion";
import { currentUserProfile } from "@/config/currentProfile";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

interface conversationIdProps{
  serverId:string;
  memberId:string
}

async function page({params}:{params:conversationIdProps}) {
    const profile = await currentUserProfile();
    const {serverId, memberId} = await params;

    if(!profile){
      return <RedirectToSignIn />;
    }

    const currentMember = await db.member.findFirst({
      where:{
        serverId:serverId,
        profileId:profile.id
      },
      include:{
        profile:true
      }
    });
    if(!currentMember){
      return redirect("/sign-in")
    }
    const converstaion = await getOrCreateConverstaion(currentMember.id, memberId);
    if(!converstaion){
      redirect(`servers/${serverId}`)
    }

    const {memberOne, memberTwo} = converstaion;

    const otherMember = memberOne.profile.id === profile.id ? memberTwo : memberOne

    return (
    <div>

      <ChatHeader 
      name={otherMember.profile.name}
      imageurl={otherMember.profile.imageUrl}
      serverId={serverId}
      type="conversation"
      />
      
      
      <ChatInput 
      apiUrl="/api/socket/direct-messages"
      query={{
        conversationId:converstaion.id
      }}
      name={otherMember.profile.name}
      type="conversation"
      />

      {/* https://stackoverflow.com/questions/76393897/how-to-call-a-notification-toast-after-a-server-action-in-nextjs13 */}
    </div>
  )
}

export default page