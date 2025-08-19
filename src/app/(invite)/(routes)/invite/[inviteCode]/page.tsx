import { redirect } from "next/navigation";

import { db } from "@/config/db";
import { currentUserProfile } from "@/config/currentProfile";

interface InviteCodeProps {
  params:Promise<{inviteCode:string}>
}

async function page({params}:InviteCodeProps) {
  const {inviteCode} = await params;
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