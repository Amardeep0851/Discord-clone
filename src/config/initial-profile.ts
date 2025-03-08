import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/config/db";

export async function initialProfile() {
  const user = await currentUser();
  if(!user){
    return redirect("/sign-in");
  }
  console.log(user.id);
  let profile = await db.profile.findFirst({
    where:{
      userId:user.id
    }
  })
  if(profile){
    return profile;
  }

  profile = await db.profile.create({
    data:{
      userId:user.id,
      name:`${user.firstName} ${user.lastName }`,
      imageUrl:user.imageUrl,
      email:user.emailAddresses[0].emailAddress
    }
  })
  return profile;
}

