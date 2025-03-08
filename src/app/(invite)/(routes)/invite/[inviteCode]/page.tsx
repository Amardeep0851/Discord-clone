import React from 'react';
import { db } from "@/config/db";
import { currentUserProfile } from "@/config/currentProfile";
import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

async function page({params}:{params:{inviteCode:string}}) {
  const {inviteCode} = params;
  const profile = await currentUserProfile();

  if(!profile){
    return redirect("/sign-in")
  }

  const existingServer = await db.server.findUnique({
    where:{
      inviteCode,
        members:{
          some:{
            profileId:profile?.id
          }
      }
    }
  });

  if(existingServer){
    return redirect(`/servers/${existingServer.id}`)
  }

  const server = await db.server.update({
    where:{
      inviteCode
    },
    data:{
        members:{
          create:[{
            profileId:profile?.id
          }]  
      }
    }
  })

  if(server){
    return redirect(`/servers/${server.id}`)
  }
  return null;
}

export default page