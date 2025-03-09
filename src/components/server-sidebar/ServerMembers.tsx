"use client"
import React from 'react'
import { useRouter, useParams } from "next/navigation";
import { Member, MemberRole, Profile } from "@prisma/client";

import { UserAvatar } from "@/components/user-avatar";
import { currentUserProfile } from "@/config/currentProfile";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Ghost } from "lucide-react";

interface ServerMembersProps{
  role?:MemberRole;
  member:Member & {profile:Profile};
}
function ServerMembers({role, member}:ServerMembersProps) {

  const router = useRouter();
  const params = useParams();

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversation/${member.id}`)
  }
  return (
    <button className={cn("flex gap-2 items-center cursor-pointer w-full dark:hover:bg-zinc-700/50 hover:bg-zinc-200 p-2 rounded font-semibold text-sm transition duration-200",)}
    onClick={onClick}
    >
      <UserAvatar src={member.profile.imageUrl} className="md:size-8 size-8" />
      <p>
      {member.profile.name}
      </p>
    </button>
  )
}

export default ServerMembers