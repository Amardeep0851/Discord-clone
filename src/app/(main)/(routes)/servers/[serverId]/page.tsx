import React from 'react'

import { db } from "@/config/db"
import { currentUserProfile } from "@/config/currentProfile";
import { redirect } from "next/navigation";

export default async function page({params}:{params:Promise<{serverId:string}>}) {

  const profile = await currentUserProfile();
  const {serverId} = await params

  const server = await db.server.findUnique({
    where:{
      id:serverId,
      members:{
        some:{
          profileId:profile?.id
        }
      }
    },
    include:{
      channels:{
        where:{
          name:"general"
        }
      }
    }
  });

  const initialChannel = server?.channels[0];
  if(!initialChannel){
    return null
  }
  return redirect(`/servers/${serverId}/channel/${initialChannel?.id}`);
}