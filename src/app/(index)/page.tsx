import { ModeToggle } from "@/components/mode-toggle"
import {initialProfile} from "@/config/initial-profile";
import { db } from "@/config/db";
import { redirect } from "next/navigation";
import {InitialModel} from "@/components/models/InitialModel";


export default async function Home() {

  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where:{
      members:{
        some:{
          profileId:profile?.id
        }
      }
    }
  })

  if(server){
    return redirect(`/servers/${server.id}`)
  }

  return <InitialModel />
}
