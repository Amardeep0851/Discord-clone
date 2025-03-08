"use client"

import React, { useEffect } from 'react'
import axios from "axios";
import * as z from "zod";
import qs from "query-string";

import { useRouter, useParams } from "next/navigation";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType } from "@prisma/client";

import { Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from "@/components/ui/dialog";
import { Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage } from "@/components/ui/form";
import { Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue } from "@/components/ui/select";

import { useModel } from "@/store/useModelStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name:z.string().min(1,{message:"Channel name is required."}),
  type:z.nativeEnum(ChannelType)
})

function CreateChannel() {
  const {isOpen, data, type, onOpen, onClose,} = useModel();
  const isModelOpen = isOpen && type === "createChannel";
  
  const {toast} = useToast();
  const router = useRouter();
  const params = useParams();
  const {server, channelType} = data;

  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      type: channelType || ChannelType.TEXT
    }
  });

  useEffect(() => {
    if(channelType) {
      form.setValue("type", channelType);
    }else{
      form.setValue("type", ChannelType.TEXT);
    }
  }
    , [form, channelType]);
  const onSubmit = async (values:z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url:`/api/channels`,
        query:{
          serverId:server?.id
        }
      });
      
      const response = await axios.post(url, values); 
      if(response.status === 200) {
        
        onOpen("createChannel", {server})
        onClose();
        router.refresh();
      }
    } catch (error) {
      console.log("[CLIENT_SERVER_CHANNEL_CREATE_", error);
      toast({
        variant:"destructive",
        title:"Failed",
        description:"Something went wrong. Please try again."
      })
    }
  }

  const handleClose = () => {
    form.reset();
    router.refresh();
    onClose();
  }
  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 bg-zinc-100  text-black">
        <DialogHeader className="">
          <DialogTitle className="text-2xl font-bold py-3 border-b-[1px] border-zinc-300 mx-5">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="px-4 space-y-4 flex flex-col">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-semibold text-normal">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0 border-zinc-400 focus-visible:border-zinc-600 hover:text-black text-black"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-semibold text-normal">
                      Channel Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        name="type"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="bg-slate-50 text-black hover:bg-slate-100 capitalize">
                          <SelectValue
                            placeholder="Select Channel Type"
                            className="text-black"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-50 transition-all text-black text-left capitalize">
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem key={type} value={type} className="">
                              {type.toLocaleLowerCase()}
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
            <DialogFooter className="bg-zinc-200 py-2 px-4 rounded-md">
              <Button size="lg" variant={"secondary"} disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChannel