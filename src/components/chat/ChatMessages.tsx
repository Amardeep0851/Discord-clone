"use client"
import React, { Fragment, useState } from 'react';
import qs from "query-string";
import {format} from "date-fns"
import { useParams } from "next/navigation";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import ChatWelcomeMessage from "./ChatWelcomeMessage";
import ChatItem from "./ChatItem";

import { Button } from "@/components/ui/button";

interface ChatMessagesProps{
  type:"channel" | "conversation";
  name:string; 
  chatId:string; 
  member:Member; 
  apiUrl:string; 
  socketUrl:string; 
  socketQuery:{
    channelId:string;
    serverId:string;
  },  
  paramKey:"channelId" | "conversationId";
  paramValue:string;
}

type MessageWithMemberWithProfile = Message & {
  member:Member & {profile:Profile}
}

export default function ChatMessages({type, name, chatId, member, apiUrl, socketUrl, socketQuery,  paramKey, paramValue}:ChatMessagesProps) {

  const params = useParams();
  const serverId = params?.serverId;
  if (!serverId || Array.isArray(serverId)) {
    throw new Error('Invalid serverId');
  }

  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:message`;
  const updateKey = `chat:${chatId}:message:update`;
  const DATE_FORMAT = "d MMM yyyy, HH:mm";
  const [isEditing, setIsEditing] = useState<string|null | undefined>(null);
  console.log(isEditing);
  const handleMessageEditing = (id?:string | null | undefined) => {
      setIsEditing(id);
    };

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
    serverId 
  });
  if(status === "pending"){
    return (
      <div className="flex justify-center items-center flex-col flex-1">
        <Loader2 className="size-6 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
      </div>
    )
  }

  if (status === "error")
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  
  return (

    <div className=" relative px-4 pt-4 pb-4 flex-1 flex flex-col overflow-y-auto h-full border-b-[1px]">
      {!hasNextPage &&  <div className="flex-1"  />}
      {!hasNextPage && <ChatWelcomeMessage type={type} name={name}/>}
      
      {hasNextPage && (<div className="my-2">
        {isFetchingNextPage 
      ?<div className="flex justify-center items-center w-full">
        <Loader2 className="size-6 text-zinc-500 animate-spin my-4 flex self-center" />
        </div>
      :<Button 
      onClick={() => fetchNextPage()}
      className="w-full dark:bg-zinc-700 dark:hover:bg-zinc-800 bg-zinc-200 hover:bg-zinc-100 text-xs transition duration-200"
      variant="ghost"
      >
        Loader previous messages
      </Button>
      }
      </div>)}
     
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.items.map((message:MessageWithMemberWithProfile) => (
              <ChatItem 
              key={message.id} 
              name={message.member.profile.name}
              imageUrl={message.member.profile.imageUrl}
              content={message.content}
              fileUrl={message.fileUrl}
              timestamp={ format(new Date(message.createAt), DATE_FORMAT) }
              deleted={message.deleted}
              isUpdated={message.createAt !== message.updateAt}
              currentMember={member}
              messageMembr={message.member}
              isEditing={isEditing}
              handleMessageEditing={handleMessageEditing}
              messageId={message.id}
              memberRole={message.member.role}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
              
              />
                
            ))}
          </Fragment>
        ))}
      </div>
      
    </div>
  )
}

