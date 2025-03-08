import { NextResponse } from "next/server";

import { db } from "@/config/db";
import { currentUserProfile } from '@/config/currentProfile';
import { Message } from "@prisma/client";

export async function GET(req:Request){
  try {
    const MESSAGES_BATCH = 10;
  let messages:Message[] = [];
  const profile = await currentUserProfile();
  const {searchParams }= new URL(req.url);
  const channelId = searchParams.get("channelId");
  const serverId = searchParams.get("serverId");
  const cursor = searchParams.get("cursor");

  if(!profile){
    return new NextResponse("Unauthorized",{status:401})
  }
  if(!channelId){
    return new NextResponse("ChannelId is missing.",{status:400})
  }
  if(!serverId){
    return new NextResponse("ServerId is missing.",{status:400})
  }
  if(cursor){
    messages = await db.message.findMany({
      take:MESSAGES_BATCH,
      skip:1,
      cursor:{
        id:cursor
      },
      where:{
        channelId
      },
      include:{
        member:{
          include:{
            profile:true
          }
        }
      },
      orderBy:{
        createAt:"desc"
      }
    })
  }else{
    messages = await db.message.findMany({
      
      take:MESSAGES_BATCH,
      where:{
        channelId
      },
      include:{
        member:{
          include:{
            profile:true
          }
        }
      },
      orderBy:{
        createAt:"desc"
      }
    })
  }
  let nextCursor = null;
  if(messages.length === MESSAGES_BATCH){
    nextCursor = messages[MESSAGES_BATCH - 1].id
  }
  return NextResponse.json({items:messages, nextCursor});
  } catch (error) {
    console.log("FETCH_MESSAGES_FOR_QUERY", error);
    return new NextResponse("Internal Server Error", {status:500})
  }
}