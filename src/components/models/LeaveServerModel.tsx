"use client"
import React from 'react';
import { useRouter } from "next/navigation";
import { Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast"
import { useModel } from "@/store/useModelStore";
import { Button } from "../ui/button";
import axios from "axios";


const DeleteServerModel = () => {
  const router = useRouter();  
  const {toast} = useToast();
  const {type, isOpen, onClose, data, onOpen} = useModel();
  const isModelOpen = isOpen && type === "leaveServer";
  const {server} = data;

  const handleLeave = async () => {
   try {
    const response = await axios.patch(`/api/servers/${server?.id}/leave`);
    if(response.status == 200)
      // onOpen({server:response?.data?.server})
      toast({
        title: "Success!",
        description: "You have successfully left this server.",
        variant: "success",
      });
      
    onClose();
    router.refresh();
   } catch (error) {
    console.log("[ERROR - DELETE SERVER MODEL]", error);

    toast({
      title: "Warning!",
      description: "Something went wrong.",
      variant: "destructive",
    });
   }
    
  }
  const handleClose = () => {
    onClose();
    router.refresh();
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-50 text-black p-0 overflow-hidden">
        <DialogHeader className="mx-4">
          <DialogTitle className="text-2xl py-3 border-b-[1px]">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-zinc-700 text-lg px-4 py-3 bg-green">
          Are you sure you want to leave the server  <b className="text-zinc-900">{server?.name} </b>? Press confirm button to leave the server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter 
        className="bg-zinc-200 px-4 py-2"
        >
        <Button 
        variant="secondary" 
        onClick={handleClose}
        className="mr-3"
        >
            Cancel
        </Button>
        <Button 
        variant="destructive"
        onClick={handleLeave}
        >
          Confirm
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteServerModel