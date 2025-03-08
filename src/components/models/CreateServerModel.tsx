"use client"
import React from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { useModel } from "@/store/useModelStore";
import FileUpload from "@/components/FileUpload";
import { useRouter } from "next/router";
import axios from "axios";
import { Input } from "../ui/input";

const formSchema = z.object({
  imageUrl:z.string().min(1,{message:"Server Image is required."}),
  serverName:z.string().min(1, {message:"Server name is required."})
})

function CreateServerModel() {
  const {type, isOpen, onClose} = useModel();
  const isModelOpen = isOpen && type === "createServer";
  
  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      serverName:"",
      imageUrl:""
    }
  })

  const handleClose = () => {
    form.reset();
    onClose();
  }

  const onsubmit = async (values:z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/servers", values);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.log("[ERROR IS WHILE CREATING SERVER ON CLICKING BUTTON]", error);
    }

  }

  const isLoading = form.formState.isSubmitting;
  return (
    <>
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-200 text-black">
        <DialogHeader>
          <DialogTitle className="text-center">
            Create Server
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-700 border-t-[1px] border-zinc-700 pt-3 px-4">
          Give your server a personality with a name and an image you can always change it later.
        </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} >
              
            <div className="flex justify-center text-center">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <FileUpload 
                  endpoint="serverImage" 
                  onChange={field.onChange}
                  value={field.value} 
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
            </div>
            <FormField
              control={form.control}
              name="serverName"
              render={({field}) => (
                <FormItem className="mt-3">
                  <FormLabel className="text-base font-semibold">
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                    placeholder="Enter server name" 
                    disabled={isLoading} 
                    className="bg-zinc-300 outline-none border-[1px] border-zinc-200 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[1px] focus-visible:border-zinc-400"
                    {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <DialogFooter className="mt-5">
                <Button  
                variant={"secondary"}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-lg font-semibold" 
                disabled={isLoading} 
                >Create</Button>
              </DialogFooter>
            </form>
          </Form>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default CreateServerModel