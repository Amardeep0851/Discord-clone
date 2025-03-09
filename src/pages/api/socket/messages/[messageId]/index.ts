import { CurrentProfileForPages } from "@/config/currentProfileForPages";
import { db } from "@/config/db";
import { NextApiRequest} from "next";
import {NextResponseWithServerIo} from "@/config/typescript-types"
import { MemberRole } from "@prisma/client";


export default async function handler(req:NextApiRequest, res:NextResponseWithServerIo){

  if(req.method !== "DELETE" && req.method !== "PATCH"){
    return res.status(405).json({error:"Method is not allowed."})
  }

  const {serverId, channelId, messageId} = req.query;
  const {content} = req.body
  const profile = await CurrentProfileForPages(req);

  if(!profile){
    return res.status(401).json({error:"Unauthorized access."})
  }

 try {
    if(!serverId){
      return res.status(400).json({error:"ServerId is required."})
    }
    if(!channelId){
      return res.status(400).json({error:"ChannelId is required."})
    }
    if(!messageId){
      return res.status(400).json({error:"MessageId is required."})
    };

    
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      include: {
        members: true
      }
    });

    if (!server)
      return res.status(404).json({ error: "Server not found" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string
      }
    });

    if (!channel)
      return res.status(404).json({ error: "Channel not found" });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member)
      return res.status(404).json({ error: "Member not found" });

    const isMessageExist = await db.message.findFirst({
      where:{
        id:messageId as string,
        channelId:channelId as string,
      },
      include:{
        member:{
          include:{
            profile:true
          }
        }
      }
    }) 
    if(!isMessageExist || isMessageExist.deleted ){
      
      return res.status(404).json({error:"Message is not found."})
    }
    let message;
    const isMessageOwner = isMessageExist.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATE;
    const canModify = isMessageOwner || isAdmin || isModerator;
    
    if (!canModify) return res.status(401).json({ error: "Unauthorized" });

    if(req.method === "DELETE"){
      message = await db.message.update({
        where:{
          id:messageId as string
        },
        data:{
          fileUrl:null,
          content:"This message has been deleted.",
          deleted:true
        },
        include:{
          member:{
            include:{
              profile:true
            }
          }
        }
      })
  }

  if(req.method === "PATCH"){
    if (!isMessageOwner)
      return res.status(401).json({ error: "Unauthorized" });

    message = await db.message.update({
      where:{
        id:messageId as string
      },
      data:{
        content:content
      },
      include:{
        member:{
          include:{
            profile:true
          }
        }
      }
    })
  }
  const updateKey = `chat:${channelId}:messages:update`;
  res?.socket?.server?.io?.emit(updateKey, message)
  return res.status(200).json({message});
 } catch (error) {
  console.log("Internal error", error);
  res.status(500).json({error:"Internal Error."})
 }

}