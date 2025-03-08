"use client"

import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
 } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModel } from "@/store/useModelStore";
import { ChannelType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name:z
  .string()
  .min(1, {message:"Channel name is required."})
  .refine((name) => name !== "general", {message:"Channel name cannot be 'general'"}),
  type:z.nativeEnum(ChannelType)
})

function EditChannel() {
  const {type, isOpen, data, onClose} = useModel();
  const {channel, server} = data;
  const router = useRouter();
  const {toast} = useToast();
  
  const isModelOpen = isOpen && type === "editChannel";

  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      type:channel?.type || ChannelType.TEXT 
    }
  });
  useEffect(() => {
    if(channel){
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  },[channel]);

  const isLoading = form.formState.isSubmitting;
  const onSubmitForm = async (values:z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url:`/api/channels/${channel?.id}`,
        query:{
          serverId:server?.id
        }
      });
      const response = await axios.patch(url, values)
      if(response.status === 200){
        toast({
          variant:"success",
          title:"Success",
          description:"Channel information is updated successfully."
        });
        form.reset();
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.log("[FRONTEND_UPDATE_CHANNEL_MODEL]", error);
      toast({
        variant:"destructive",
        title:"Failed",
        description:"Something went wrong. Please try again."
      });
      form.reset();
      router.refresh();
      onClose();
    }
  }
  const handleClose = () => {
    onClose();
    form.reset();
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-100 p-0 text-black transition overflow-hidden">
      <DialogHeader className="px-5">
        <DialogTitle className="pt-4 pb-2 text-center text-xl border-b-[1px] border-b-zinc-400">
          Edit Channel 
        </DialogTitle>
        <DialogDescription className="text-zinc-700 pt-3">
        Change channel's name and/or image. After making the changes, click the update button to save the information.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 ">
          <div className="space-y-5 px-5">
            <FormField 
          name="name"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Name
              </FormLabel>
              <FormControl>
                <Input 
                disabled={isLoading}
                value={field.value}
                onChange={field.onChange}
                className="text-black bg-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-700 border-zinc-500 hover:shadow-md transition"
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField 
          name="type"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Channel Type
              </FormLabel>
              <FormControl>
                <Select 
                defaultValue={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
                >
                  <SelectTrigger className="capitalize text-black bg-zinc-100  border-zinc-500 hover:shadow-md transition focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-700">
                    <SelectValue placeholder="Select Channel Type" className="bg-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-700"/>
                  </SelectTrigger>
                  <SelectContent className="capitalize bg-slate-100 text-back">
                    {Object.values(ChannelType).map((type) => (
                      <SelectItem value={type} key={type} className="cursor-pointer text-black hover:bg-zinc-300 transition">
                        {type.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          
          </div>
        
        <DialogFooter className="bg-zinc-200 px-5 py-2 flex gap-3 rounded-b-md" >
          <Button variant="secondary" size="sm" disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" disabled={isLoading}>
            Update
          </Button>
        </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditChannel