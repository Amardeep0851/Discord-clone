import { NextResponse } from "next/server";

import { db } from "@/config/db";
import { currentUserProfile } from "@/config/currentProfile";
import { MemberRole } from "@prisma/client";

export async function DELETE(req:Request, {params}:{params:{channelId:string}}){
  
  try {
    const profile = await currentUserProfile();  
    const {searchParams} = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if(!serverId){
      return new NextResponse("ServerId is missing.", {status:400})
    }
    if(!params.channelId){
      return new NextResponse("channel Id is missing.", {status:400})
    }
    if(!profile?.id){
      return new NextResponse("Unauthorized access.", {status:400})
    }
    const server = await db.server.update({
      where:{
        id:serverId,
        members:{
          some:{
            profileId:profile.id,
            role:{
              in:[MemberRole.ADMIN, MemberRole.MODERATE]
            }
          }
        }
      },
      data:{
        channels:{
          delete:{
              id:params.channelId,
              name:{
                not:"general"
              }          
          }
        }
      }
    })

    return NextResponse.json({server});
  } catch (error) {
    console.log("[]", error);
    return new NextResponse("Internal error.", {status:500})
  }
}

export async function PATCH(req:Request, {params}:{params:{channelId:string}}){
  try{
    const profile = await currentUserProfile();
    const {searchParams} = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const {name, type} = await req.json();

    if(!params.channelId){
      return new NextResponse("Channel id is missing",{status:400});
    }
    if(!serverId){
      return new NextResponse("Server id is missing",{status:400});
    }
    if(!profile?.id){
      return new NextResponse("Unauthorized access.",{status:400});
    }
    if(!name){
      return new NextResponse("Name Cannot be empty", {status:400})
    }
    if(!type){
      return new NextResponse("Type Cannot be empty", {status:400})
    }
    const server = await db.server.update({
      where:{
        id:serverId,
        members:{
          some:{
            profileId:profile.id,
            role:{
              in:[MemberRole.ADMIN, MemberRole.MODERATE]
            }
          }
        },
      },
      data:{
        channels:{
          update:{
            where:{
              id:params.channelId
            },
            data:{
              name,
              type
            }
          }
        }
      }
    });

    return NextResponse.json({server});
} catch (error) {
    console.log("[BACKEND_UPDATE_CHANNEL]", error);
    return new NextResponse("Internal error.", {status:500})
}
}