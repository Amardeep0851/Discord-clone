import { NextApiRequest } from "next";
import { NextResponseWithServerIo } from "@/config/typescript-types";
import { CurrentProfileForPages } from "@/config/currentProfileForPages";
import { db } from "@/config/db";
import { MemberRole } from "@prisma/client";
export default async function handler(
  req: NextApiRequest,
  res: NextResponseWithServerIo
) {
  try {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    const profile = await CurrentProfileForPages(req);

    const { serverId, channelId, messageId } = req.query;
    const { content, fileUrl } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unathorized access." });
    }

    if (!serverId) {
      return res.status(400).json({ error: "ServerId is missing." });
    }

    if (!channelId) {
      return res.status(400).json({ error: "ChannelId is missing." });
    }

    if (!messageId) {
      return res.status(400).json({ error: "ChannelId is missing." });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: { 
          some: { 
            profileId: profile?.id 
          } 
        },
      },
      include: { 
        members:true 
      },
    });

    if (!server) {
      return res.status(400).json({ error: "Server does not found." });
    }

    const channel = await db.channel.findFirst({
      where: { id: channelId as string, serverId: serverId as string },
    });

    if (!channel) {
      return res.status(400).json({ error: "Channel does not found." });
    }

     const member = server.members.find((member) => {
      return member.id === profile.id
    });

    if(!member){
      return res.status(404).json({error:"Member now found."})
    }

    let message = await db.message.findFirst({
      where:{
        id:messageId as string,
        channelId: channelId as string
      },
      include:{
        member:{
          include:{
            profile:true
          }
        }
      }
    })

    if(!message || message.deleted){
      return res.status(404).json({error:"message not found."})
    }

   
    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role = MemberRole.MODERATE
    const canModify = isMessageOwner || isAdmin || isModerator;

    if(!canModify){
      return res.status(401).json({message:"Unauthorized"})
    }

    if(req.method === "PATCH"){
      if(!isMessageOwner){
        return res.status(401).json({message:"Unauthorized."})
      }

      message = await db.message.update({
        where:{
          id:messageId as string
        },
        data:{
          content
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

    if(req.method === "DELETE"){
      message = await db.message.update({
        where:{
          id:messageId as string
        },
        data:{
          fileUrl:null,
          content:"This message has been deleted",
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


    const updateKey = `chat:${channelId}:message:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json({ message });
  } catch (error) {
    console.log("[CHAT_INPUT_ERROR_BACKEND]", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
