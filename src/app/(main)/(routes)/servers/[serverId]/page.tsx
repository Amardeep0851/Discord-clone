import React from 'react'

import { db } from "@/config/db"
import { currentUserProfile } from "@/config/currentProfile";
import { redirect } from "next/navigation";

export default async function page({params}:{params:{serverId:string}}) {

  const profile = await currentUserProfile();

  const server = await db.server.findUnique({
    where:{
      id:params.serverId,
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
  return redirect(`/servers/${params.serverId}/channel/${initialChannel?.id}`);
}