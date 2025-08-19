import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { currentUserProfile } from "@/config/currentProfile";

export async function PATCH(req:Request, {params}:{params:Promise<{serverId:string}>}){
  try {
    const profile = await currentUserProfile();
    const {serverId} = await params
    if(!profile){
      return new NextResponse("Unauthorized access.",{status:401})
    }

    if(!serverId){
      return new NextResponse("Server id is missing",{status:400})
    }
    const server = await db.server.update({
      where:{
        id:serverId,
        profileId:{
          not:profile.id
        },
        members:{
          some:{
            profileId:profile.id
          }
        }
      },
      data:{
        members:{
          deleteMany:{
            profileId:profile?.id
          }
        }
      }
    })
    return NextResponse.json({server});
  } catch (error) {
    console.error("[SERVER_ID_LEAVE_PATCH]", error);
    return new NextResponse("Internal Server Error", {status:500})
  }
}