"use client"
import React, { useState } from 'react';
import {RefreshCw, Check, Copy} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import axios from "axios";
import ActionTooltip from "../ActionTooltip";
import { ServerWithMembersWithProfiles } from "@/config/typescript-types";

import { useModel } from "@/store/useModelStore";
import { useOrigin } from "@/hooks/use-origin";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function InvitePeople() {

  const origin = useOrigin();
  const [generateLinkLoading, setGenerateLinkLoading] = useState(false);
  const [isColpied, setIsCopied] = useState(false);
  const {isOpen, type, data, onClose, onOpen} = useModel();
  
  const isModelOpen = isOpen && type === "invitePeople";
  const {server} = data;

  const inviteLink = `${origin}/invite/${server?.inviteCode}`

  const generateLink = async () => {
    try {
      setGenerateLinkLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite`);
      onOpen("invitePeople", {server:response.data.server})
    } catch (error) {
      console.log("[ERROR WHILE GENERATING INVITE CODE,]", error);
    }
    finally{
      setGenerateLinkLoading(false);
    }
  }

  const onCopy = () =>{
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  }

  return (
      <Dialog open={isModelOpen} onOpenChange={onClose}>
        <DialogContent className="p-3 px-5 bg-zinc-200 text-black">
          <DialogHeader className="">
            <DialogTitle className="text-xl font-semibold pb-2 text-center">
              Invite People
            </DialogTitle>
            <DialogDescription className="text-zinc-600 text-sm border-t-[1px] border-zinc-600 pt-3">
            Share this link with others to invite them and grow your community. It's a simple way to connect and collaborate with more people!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row space-x-3">
            <label className="pt-2 font-semibold w-fit">Server&nbsp;Invite&nbsp;Link</label>
            <div className="flex flex-row w-full">
              <Input 
                readOnly
                placeholder={inviteLink}
                disabled={generateLinkLoading}
                className="bg-zinc-100 text-base text-zinc-900 outline-none ring-0 border-[1px] border-zinc-400 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:border-[1px] focus-visible:border-zinc-300"
               />
              
            </div>
            <ActionTooltip label="copy" align="center" side="top">
              <Button 
              className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 dark:hover:bg-zinc-700 " 
              disabled={generateLinkLoading}
              onClick={onCopy}
              >
                {isColpied ? 
                <Check className="w-4 h-4 text-zinc-50" />
                : 
                <Copy className="w-4 h-4 text-zinc-50" /> 
                }
              </Button>
            </ActionTooltip>
          </div>
        <div>
          <Button 
            variant="link"
            className="text-base text-zinc-700 p-0 m-0"
            onClick={generateLink}
            disabled={generateLinkLoading}
          >
            Generate a new link <RefreshCw className={cn("size-4", generateLinkLoading ? "animate-spin" : "")} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    
  );
}

export default InvitePeople