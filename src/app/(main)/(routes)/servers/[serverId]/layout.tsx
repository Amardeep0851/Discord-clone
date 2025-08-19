import React from 'react'
import ServerSidebar from "@/components/server-sidebar/ServerSidebar";
import { currentUserProfile } from "@/config/currentProfile";
import { RedirectToSignIn } from "@clerk/nextjs"
import { db } from "@/config/db";
import { redirect } from "next/navigation";

interface ServerlayoutProps{
  children:React.ReactNode, 
  params:Promise<{serverId:string}>     
}

async function Layout({ children, params }:ServerlayoutProps) {
  const profile = await currentUserProfile();
  const {serverId} = await params;

  if(!profile){
    return <RedirectToSignIn />;
  }
  
  const server = await db.server.findFirst({
    where:{
      id:serverId
    },
    include:{
      members:{
        include:{
          profile:true
        }
      }
    }
  });

  if(!server)
  {
    return redirect("/")
  }
  return (
    <div className="flex flex-row min-h-screen">
      <div className="flex max-md:hidden max-md:invisible flex-col h-full z-20 w-60 fixed inset-y-0 ">
      <ServerSidebar serverId={serverId} />
      </div>
      <div className="md:ml-60 min-h-screen w-full ">{children}</div>
    </div>
  )
  }

  export default Layout