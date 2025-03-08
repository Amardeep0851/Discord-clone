import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const currentUserProfile = async () => {
  const {userId} = await auth();

  if(!userId){
    return null
  }
  const profile = await db.profile.findFirst({
    where:{ userId }
  })

  if(!profile){
    throw new Error("Unauthorized.")
  }

  return profile;
}