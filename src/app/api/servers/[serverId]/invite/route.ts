import { NextResponse } from "next/server";
import { currentUserProfile } from "@/config/currentProfile";

import {v4 as uuidV4} from "uuid"
import { db } from "@/config/db";
import { MemberRole } from "@prisma/client";

export async function PATCH(req:Request, {params}:{params:{serverId:string}}){

  const profile = await currentUserProfile();
  if(!profile) {
    return new NextResponse("Unauthorized access.", {status:401});
  }

  if(!params.serverId) {
    return new NextResponse("Server ID is missing", {status:401});
  }
    
  const server = await db.server.update({
    where:{
      id:params.serverId,
    },
    data:{
      inviteCode:uuidV4()
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
  });

  return NextResponse.json({server:server})

}
