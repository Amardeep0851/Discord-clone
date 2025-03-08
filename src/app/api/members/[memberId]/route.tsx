import { NextResponse } from "next/server";
import { currentUserProfile } from "@/config/currentProfile";
import { db } from "@/config/db";

export async function PATCH(req:Request, {params}:{params:{memberId:string}}){
  try {
    const profile = await currentUserProfile();

  const {searchParams} = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const {memberRole} = await req.json();


  if(!profile?.userId){
    return new NextResponse("Unauthorized access.", {status:400})
  }

  if(!params.memberId){
    return new NextResponse("Member Id is missing.", {status:400})
  }

  if(!serverId){
    return new NextResponse("Server Id is missing.", {status:400})
  }

  const server = await db.server.update({
    where:{
      id:serverId,
      profileId:profile.id
    },
    data:{
      members:{
        update:{
          where:{
            id:params.memberId,
            profileId:{
              not:profile.id
            }
          },
          data:{
            role:memberRole
          }
        }
      }
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
  })
 
    return NextResponse.json({server})
  } catch (error) {
    console.log("[MEMBER_ID_PATCH]", error);
    return new NextResponse("Internal error", {status:500})
  }
  
}

export async function DELETE(req:Request, {params}:{params:{memberId:string}}){
  try {
  const profile = await currentUserProfile();
  const memberId:string = params.memberId;
  const {searchParams} = new URL(req.url)
  const serverId: string | null = searchParams.get("serverId");
  if(!profile){
    return new NextResponse("Unauthorized access.", {status:400})
  }
  if(!serverId){
    return new NextResponse("Server Id is missing", {status:400})
  }
  if(!memberId){
    return new NextResponse("Member Id is missing", {status:400})
  }

  const server = await db.server.update({ 
    where:{
    id:serverId,
    profileId:profile?.id
    },
    data:{
    members:{
      deleteMany:{
        id:memberId,
        profileId:{
          not:profile?.id
        }
      }
    }
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
  return NextResponse.json({server})
  } catch (error) {
    console.log("[BACKEND_ERROR_WHILE_DELETEING_MEMBER]", error);
    return new NextResponse("Internal error", {status:500})
  }
}