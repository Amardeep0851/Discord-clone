import { NextApiRequest } from "next";

import { NextResponseWithServerIo } from "@/config/typescript-types";
import { CurrentProfileForPages } from "@/config/currentProfileForPages";
import { db } from "@/config/db";

export default async function handler( req:NextApiRequest, res:NextResponseWithServerIo ){
  try {
    if (req.method !== "POST"){
      return res.status(405).json({ error: "Method not allowed" });
    }

    const profile = await CurrentProfileForPages(req);
    const {serverId, channelId} = req.query;
    const {content, fileUrl} = req.body;


    if(!profile){
      return res.status(401).json({error:"Unathorized access."})
    }

    if(!serverId){
      return res.status(400).json({error:"ServerId is missing."})
    }

    if(!channelId){
      return res.status(400).json({error:"ChannelId is missing."})
    }
 

    const server = await db.server.findFirst({
      where:{
        id:serverId as string,
        members:{
          some:{
            profileId:profile?.id
          }
        }
      },
      include:{
        members:{
          where:{
            profileId:profile?.id
          }
        }
      }
    });

    if(!server){
      return res.status(400).json({error:"Server does not found."})
    }

    const channel = db.channel.findFirst({
      where:{
        id:channelId as string,
        serverId:serverId as string
      }
    });

    if(!channel){
      return res.status(400).json({error:"Channel does not found."})
    }

    const message = await db.message.create({
      data:{
        content,
        fileUrl,
        memberId:server.members[0].id,
        channelId:channelId as string
      }
    });
    const chatKey = `chat${channelId}`;
    res.socket.server.io.emit(chatKey, message);
    return res.status(201).json({message})
  } catch (error) {
    console.log("[CHAT_INPUT_ERROR_BACKEND]", error);
    return res.status(500).json({ error: "Internal server error." });
  }      
}

