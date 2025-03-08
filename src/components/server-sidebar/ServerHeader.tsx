"use client"
import React from 'react';
import { useModel } from "@/store/useModelStore";
import { Trash, UserPlus, Settings, User, PlusCircleIcon, ChevronDown } from "lucide-react";
import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { db } from "@/config/db";
import { ServerWithMembersWithProfiles } from "@/config/typescript-types";
import { MemberRole } from "@prisma/client";

type serverHeaderProps = {
  role:string | undefined;
  server: ServerWithMembersWithProfiles
}

function ServerHeader({role, server}:serverHeaderProps) {
  const {onOpen} = useModel();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerate = role === MemberRole.MODERATE || isAdmin; 
  
  return (
    <div>
      <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="focus:outline-none" asChild>        
        <Button 
          variant="outline" 
          className=" w-full text-base font-semibold cursor-pointer px-3 border-neutral-200 border-b-2 hover:bg-zinc-700/10 dark:border-neutral-800 dark:bg-zinc-900 dark:hover:bg-zinc-700 transition"
        >
          <p>Server Settings</p> 
          <ChevronDown className="w-6 h-6 ml-auto" />
        </Button>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-52 dark:bg-zinc-900 text-sm ext-black dark:text-neutral-200 space-y-[2px]"
      >
        {isModerate && (
          <DropdownMenuItem 
          className=" cursor-pointer px-3 py-2 "
          onClick={() => onOpen("invitePeople",{server})}
        > 
          Invite People 
          <UserPlus className="w-2 h-2 ml-auto" /> 
        </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem 
          className=" cursor-pointer px-3 py-2 "
          onClick={() => onOpen("editServer", {server})}
        > 
          Server Settings 
          <Settings className="w-2 h-2  ml-auto" />
        </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem 
          className=" cursor-pointer px-3 py-2 "
          onClick={() => onOpen("managerMember", {server})}
          > 
          Manager Members 
          <User className="w-2 h-2  ml-auto" />
        </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem 
          className=" cursor-pointer px-3 py-2 "
          onClick={() => onOpen("createChannel", {server})}
          > 
          Create Channel 
          <PlusCircleIcon className="w-2 h-2  ml-auto" />
        </DropdownMenuItem>
        )}
        <DropdownMenuSeparator  />
        {
          !isAdmin && (<DropdownMenuItem 
            className="cursor-pointer px-3 py-2 "
            onClick={() => onOpen("leaveServer", {server})}
            > 
            Leave Server <Trash className="w-2 h-2  ml-auto" />
          </DropdownMenuItem>)
        }
        {
          isAdmin && (
            <DropdownMenuItem 
          className="cursor-pointer px-3 py-2 "
          onClick={() => onOpen("deleteServer", {server})}
          > 
          DeleteServer <Trash className="w-2 h-2  ml-auto" />
        </DropdownMenuItem>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  )
}

export default ServerHeader