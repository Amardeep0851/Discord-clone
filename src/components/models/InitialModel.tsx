"use client";
import React from 'react'
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation"
import {useUser} from "@clerk/nextjs"
import { useForm } from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import axios from "axios"

import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "../FileUpload";

const formSchema = z.object({
  serverName:z.string().min(1,{message:"server name is required."}),
  imageUrl:z.string().min(1,{
    message:"Server image is required."
  })
})

function InitialModel() {  
  const [dialogBoxStatus, setDialogBoxStatus] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  
  
  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      serverName:"",
      imageUrl:""
    },
  });
  useEffect(() => {
    setIsMounted(true);
  },[]);


  if(!isMounted){
    return null;
  }
  const onsubmit = async (values:z.infer<typeof formSchema>) => {
  try {
    const response = await axios.post("/api/servers", values);
    form.reset();
    router.refresh();
    window.location.reload();
  } catch (error) {
    console.log(error);
  }

  }
  const isLoading = form.formState.isSubmitting;
  if(!dialogBoxStatus){
    setTimeout(() => {
      setDialogBoxStatus(true)
      form.reset();
    }, 2000);
  }
  return (
    <div className="p-0">

    <Dialog open={dialogBoxStatus} onOpenChange={() => setDialogBoxStatus(!dialogBoxStatus)} >
      <DialogContent className="bg-white text-black overflow-hidden shadow-lg shadow-slate-400 p-0 ">
        <DialogHeader className="text-center mt-3 pt-0 pb-0 px-4">
          <DialogTitle className="text-center text-3xl font-bold">
            Customize your server
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500 border-t-[1px] border-zinc-200 pt-3 px-4">
          Give your server a personality with a name and an image you can always change it later.
        </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="px-6 pb-6">
              <div className="space-y-8">
              <div className=" flex items-center justify-center text-center">
              <FormField 
                control={form.control}
                name="imageUrl"
                render={({field}) => (
                <FormItem className="" >
                <FormControl >
                
                <FileUpload 
                endpoint="serverImage" 
                value={field.value} 
                onChange={field.onChange}
                />
                
                  </FormControl>
                </FormItem>
                )}
              />
              </div>
            <div className="w-full">
            <FormField 
              control={form.control}
              name="serverName"
              render={({field}) => (
                <FormItem className="" >
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 ">
                    Server Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                    placeholder="Enter name here" 
                    disabled={isLoading} 
                    {...field}
                    className="bg-zinc-300/50 text-black focus-visible:ring-offset-0 focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}  
              />
            </div>
              <DialogFooter className="w-full">
                <Button 
                disabled={isLoading}
                variant="secondary" 
                className="w-full">Create Server
                </Button>
              </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
    </Dialog>
    </div>
  )
}

export {InitialModel}