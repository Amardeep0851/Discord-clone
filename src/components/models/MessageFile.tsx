import React, { useState } from 'react';
import { z } from "zod";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem 
} from "../ui/form";

import FileUpload from "../FileUpload";
import { useModel } from "@/store/useModelStore"
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  fileUrl:z.string().min(1, {message:"Attachment file is required."}),
})

function MessageFile() {

  const {isOpen, type, onClose, data:{apiUrl, query}} = useModel();
  const isModelOpen = isOpen && type === "messageFile";
  const [fileType, setFileType] = useState<string | undefined>(undefined);
  const router = useRouter()

  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      fileUrl:""
    }
  })
  const handleClose = () => {
    onClose();
    form.reset()
    router.refresh();
  }
  
  const formSubmit = async (values:z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });
      await axios.post(url, {...values, content:fileType});
      handleClose();
    } catch (error) {
      console.error(error)
    }
  }
  const isLoading = form.formState.isSubmitting;
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
          <DialogContent className="p-0 bg-zinc-100  text-black">
            <DialogHeader className="">
              <DialogTitle className="text-xl font-bold py-3 border-b-[1px] border-zinc-300 mx-5">
                Add an attachment
              </DialogTitle>
              <DialogDescription>
                Send a file as a message.
              </DialogDescription>
            </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
            <FormField
            name="fileUrl"
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <FileUpload 
                    endpoint="messageFile"
                    onChange={(url, fileType) => {
                      field.onChange(url);
                      setFileType(fileType);
                    }}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
            />
            <DialogFooter className="p-2 space-x-6" >
              <Button type="button" onClick={handleClose} variant="secondary">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Cancel"}
              </Button>
            <Button type="submit" variant="destructive" disabled={isLoading} >
              Send
            </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageFile