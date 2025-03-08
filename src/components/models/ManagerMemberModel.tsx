import React, { useState } from 'react';

import { MemberRole } from "@prisma/client";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";

import { Check, 
  Gavel,
  Loader2,
  Shield,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Trash} from "lucide-react";
  import { Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription } from "@/components/ui/dialog";
    import { DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuPortal,
      DropdownMenuSeparator,
      DropdownMenuSub,
      DropdownMenuSubContent,
      DropdownMenuTrigger,
      DropdownMenuSubTrigger, 
    } from "@/components/ui/dropdown-menu";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { useModel } from "@/store/useModelStore";
    import { Button } from "../ui/button";
    import { ServerWithMembersWithProfiles } from "@/config/typescript-types";
    import { UserAvatar } from "../user-avatar";
    import { useToast } from "@/hooks/use-toast";
import ActionTooltip from "../ActionTooltip";


const ManagerMemberModel = () => {
  const {type, isOpen,onOpen,  onClose, data} = useModel();
  const isModelOpen = isOpen && type === "managerMember";
  const router = useRouter();
  const {server} = data as {server:ServerWithMembersWithProfiles};
  const [loadingId, setLoadingId] = useState<string>("");
  const {toast} = useToast();

  const roleIconMap = {
    [MemberRole.ADMIN] : <ShieldAlert className="size-4 ml-1" />,
    [MemberRole.MODERATE] : <ShieldCheck className="size-4 ml-1" />,
    [MemberRole.GUEST] : <ShieldQuestion className="size-4 ml-1" />,
  }

  const onRoleChange = async (memberId:string, memberRole:string) => {
    try {
      setLoadingId(memberId);
    const url = qs.stringifyUrl({
      url:`/api/members/${memberId}`,
      query:{serverId:server.id
      }
    });
    const response = await axios.patch(url, {memberRole});
    if(response.status == 200){
      toast({
        variant:"success",
        title:"Success",
        description:"Member role has changed successfully."
  
      })
      onOpen("managerMember", {server:response.data.server})
    }
    
    router.refresh();  
      
    } catch (error) {
      console.log("[CLIENT_MEMBER_ID_PATCH]", error);
      toast({
        variant:"destructive",
        title:"Failed",
        description:"Somethign went wrong. Please try again."
  
      })
    }
    finally{
      setLoadingId("")
    }
  }

  const onDelete = async (memberId:string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server.id
        }
      });
  
      const response = await axios.delete(url);
      if(response.status == 200){
        toast({
          variant:"success",
          title:"Success",
          description:"User has been removed successfully."
        })
      }
      router.refresh();
      onOpen("managerMember", {server})
    } catch (error) {
      console.log("[CLIENT_MEMBER_DELETE]", error);
      toast({
        variant:"destructive",
          title:"Failed",
        description:"Something went wrong. Please try again."
      })
    }finally{
      setLoadingId("")
    }
    
  }
  const handleClose = () => {
    router.refresh();
    onClose();

  }
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-100 text-black overflow-hidden p-0 pb-4">
        <DialogHeader>
          <DialogTitle className="py-4 text-center mx-4 border-b-[1px] border-zinc-300">
            Manager Members
          </DialogTitle>
          <DialogDescription className="text-base text-zinc-700">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (


            <div key={member.id} className="flex mx-4 space-x-3 pb-1 mb-3 items-center justify-between border-b-[1px] border-zinc-300">
              <div className=" flex space-x-3">
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col w-full">
                  <div className="font-semibold flex items-center">
                    <p>{member.profile.name}</p>
                    <ActionTooltip label={member.role} align="center" side="right">
                    {roleIconMap[member.role]}
                    </ActionTooltip>
                  </div>
                  <p className="text-sm text-zinc-500 ">
                    {member.profile.email}
                  </p>
                </div>
              </div>
              {server.profileId !== member.profileId &&
              loadingId !==member.id && <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer ">
                  <MoreVertical className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Gavel className="size-4" />
                      Role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem className="cursor-pointer"
                        onClick={() => {
                          if(MemberRole.GUEST === member.role){
                            return null;
                          }
                          return onRoleChange(member.id, MemberRole.GUEST)}
                        }
                        >
                          <Shield className="size-4" /> Guest
                          {member.role === MemberRole.GUEST && <Check className="size-4 " />}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer"
                         onClick={() => {
                          if(MemberRole.MODERATE === member.role){
                            return null;

                          }
                          return onRoleChange(member.id, MemberRole.MODERATE)}
                        }
                        >
                          <ShieldCheck className="size-4" />
                          Moderate
                          {member.role === MemberRole.MODERATE && <Check className="size-4 " />}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => onDelete(member.id)}>
                    <Trash className="size-4 " />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>}              
            {loadingId === member.id && (<Loader2 className="size-4 animate-spin text-zinc-500" />)}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ManagerMemberModel