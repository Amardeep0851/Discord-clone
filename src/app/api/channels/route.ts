import { NextResponse } from "next/server";

import { currentUserProfile } from "@/config/currentProfile";
import { db } from "@/config/db";
import { MemberRole } from "@prisma/client";

export async function POST(req:Request){
  try {
  const profile = await currentUserProfile();
  const {searchParams} = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const {name, type} = await req.json();

  if(!profile){
    return new NextResponse("Unauthorized access.", {status:401})
  }
  if(!serverId){
    return new NextResponse("Server Id is missing.", {status:400})
  }
  if(!name || !type)
    return new NextResponse('"Name" and "Type" are required.', {status:400})
  const server = await db.server.update({
    where:{
      id:serverId,
      members:{
        some:{
          role:{
            in:[MemberRole.ADMIN, MemberRole.MODERATE]
          }
        }
      }
    },
    data:{
      channels:{
        create:{
          name,
          type,
          profileId:profile.id
        }
      }
    },
    include:{
      members:{
        include:{
          profile:true
        },
        orderBy:{
          role:"asc"
        }
      },
      channels:{
        orderBy:{
          createdAt:"asc"
        }
      }
    }
  })
  return NextResponse.json({server});
  } catch (error) {
    console.log("[SERVER_SIDE_CREATEING_CHANNEL_ERROR]", error);
    return new NextResponse("Internal error.",{status:500})
  }
}
