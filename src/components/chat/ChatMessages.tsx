"use client"
import {format} from "date-fns";
import { useParams } from "next/navigation";
import { Loader2, ServerCrash } from "lucide-react";
import { Member, Message, Profile } from "@prisma/client";
import React, { ElementRef, Fragment, useRef, useState } from 'react';

import ChatItem from "./ChatItem";
import ChatWelcomeMessage from "./ChatWelcomeMessage";

import { Button } from "@/components/ui/button";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface ChatMessagesProps{
  type:"channel" | "conversation";
  name:string; 
  chatId:string; 
  member:Member; 
  apiUrl:string; 
  socketUrl:string; 
  socketQuery:Record<string, string>,  
  paramKey:"channelId" | "conversationId";
  paramValue:string;
}

type MessageWithMemberWithProfile = Message & {
  member:Member & {profile:Profile}
}

export default function ChatMessages({type, name, chatId, member, apiUrl, socketUrl, socketQuery,  paramKey, paramValue}:ChatMessagesProps) {

  const params = useParams();
  const serverId = params?.serverId;

  const topRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const [isEditing, setIsEditing] = useState<string|null | undefined>(null);

  if (!serverId || Array.isArray(serverId)) {
    throw new Error('Invalid serverId');
  }

  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:message`;
  const updateKey = `chat:${chatId}:message:update`;
  console.log(queryKey, addKey, updateKey);
  const DATE_FORMAT = "d MMM yyyy, HH:mm";
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

  useChatSocket({
    queryKey,
    addKey,
    updateKey
  })

  useChatScroll({
    topRef,
    bottomRef,
    loadMore:fetchNextPage,
    count:data?.pages?.[0]?.items?.length ?? 0,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
  })

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

    <div className=" relative px-4 pt-4 pb-4 flex-1 flex flex-col overflow-y-auto border-b-[1px] h-[1900px] "
    onScroll={() => console.log("dd")}
    ref={topRef}
    >
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
              key={message?.id} 
              name={message?.member?.profile?.name}
              imageUrl={message?.member?.profile?.imageUrl}
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
              memberRole={message?.member?.role}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
              
              />
                
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}

