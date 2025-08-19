import { NextResponse } from "next/server";

import { currentUserProfile } from '@/config/currentProfile';
import { db } from "@/config/db";
import { MemberRole } from "@prisma/client";

export async function PATCH(
  req:Request,
  {params}:{params:Promise<{serverId:string}>}
){
  try {
    
  const {imageUrl, serverName} = await req.json() as {imageUrl:string, serverName:string};
  const {serverId} = await params
  const profile = await currentUserProfile();

  if(!profile){
    return new NextResponse("Unauthorized access.", {status:401})
  }

  if(!serverId){
    return new NextResponse("Server ID is missing.")
  }

  const server = await db.server.update({
    where:{
      id:serverId
    },
    data:{
      name:serverName,
      imageUrl
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
  return NextResponse.json({server})

  } catch (error) {
    console.log("[Server Error - UPDATING SERVER NAME AND IMAGE]", error );
  }
}


export async function DELETE(
  req:Request,
  {params}:{params:Promise<{serverId:string}>}
){
  const {serverId} = await params;
  const Profile = await currentUserProfile();
  const server = await db.server.delete({
    where:{
      id:serverId,
      profileId:Profile?.id
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
  return NextResponse.json({server})
}