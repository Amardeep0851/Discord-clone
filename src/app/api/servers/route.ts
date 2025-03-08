import { currentUserProfile } from '@/config/currentProfile';
import { db } from "@/config/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"
export async function POST(req:Request){
try {
  
const {serverName, imageUrl} = await req.json();
const profile = await currentUserProfile();

if(!profile){
  return new NextResponse("Unauthorized", {status:401})
}

const server = await db.server.create({
  data:{
    name:serverName,
    imageUrl:imageUrl,
    inviteCode:uuidv4(),
    profileId:profile.id,
    members:{create:[{profileId:profile.id, role:MemberRole.ADMIN}]},
    channels:{create:[{name:"general", profileId:profile.id}]}
  }
});

return NextResponse.json({server})

} catch (error) {
  console.error("[ERROR WHILE CREATING SERVER]", error);
  return new NextResponse("Internal error.", {status:500})
}
}