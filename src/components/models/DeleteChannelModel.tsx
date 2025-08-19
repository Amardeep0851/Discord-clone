import React, { useState } from 'react';
import qs from "query-string";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import { useModel } from "@/store/useModelStore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import axios from "axios";

function DeleteChannelModel() {

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {type, isOpen, data, onClose} = useModel();
  const {server, channel} = data;
  const isModelOpen = isOpen && type === "deleteChannel";
  const router = useRouter();
  const {toast} = useToast();
  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)
      const url = qs.stringifyUrl({
        url:`/api/channels/${channel?.id}`,
        query:{
          serverId:server?.id
        }
      })
      const response = await axios.delete(url);
      if(response.status === 200){
        toast({
          variant:"success",
          title:"Success",
          description:"Channel has been delete Successfully."
        })
        onClose();
        router.refresh();
      }
    } catch (error) {
      console.log("[FRONTEND_DELETE_MODEL_ERROR]", error);
      toast({
        variant:"destructive",
        title:"Failed",
        description:"Something went wrong. Please try again."
      });
      onClose();
      router.refresh();
    }
    finally{
      setIsSubmitting(false)
    }
  }
  const handleClose = () => {
    onClose();
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-100 text-black p-0 transition">
      <DialogHeader>
        <DialogTitle className="py-4 mx-5 text-center text-xl border-b-[1px] border-zinc-400">
          Delete Channel 
        </DialogTitle>
        <DialogDescription className="text-zinc-800 text-base px-5 py-4 ">
          Are you sure you want to delete &quot;{channel?.name}&quot;? This channel will be deleted permanently.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="bg-zinc-200 p-2 flex gap-3">
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleConfirm} disabled={isSubmitting}>
          Confirm
        </Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteChannelModel