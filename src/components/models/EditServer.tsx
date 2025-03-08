"use client"
import React, { useEffect } from 'react';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription } from "../ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl } from "@/components/ui/form"
import FileUpload from "../FileUpload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModel } from "@/store/useModelStore";
import axios from "axios";

const formSchema = z.object({
  imageUrl:z.string().min(1,{message:"Image is required."}),
  serverName:z.string().min(1,{message:"Server name is required."}),
})

function EditServer() {
  const {type, data, onClose, isOpen, onOpen}= useModel();
  const router = useRouter();

  const isModelOpen = isOpen && type === "editServer";
  const {server} = data ;

  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      serverName:"",
      imageUrl:"",
    }
  });

  useEffect(() => {
    if (server  && server.name && server.imageUrl) {
      form.setValue("serverName", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/servers/${server?.id}`, values);
      console.log(response);
      form.reset();
      router.refresh();
      // window.location.reload();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    router.refresh();

  };

  const isLoading = form.formState.isSubmitting;
  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 bg-zinc-100 text-black overflow-hidden">
        <DialogHeader className="py-4 px-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Server Settings
          </DialogTitle>
          <DialogDescription className="py-2 text-zinc-600">
          Change your server name and/or image. After making the changes, click the update button to save the information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="py-1 px-6 space-y-4">
          <div className="flex justify-center text-center">
          <FormField 
          name="imageUrl"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormControl>
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
          <FormField 
          name="serverName"
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel className="font-semibold text-base">
                Server Name:
              </FormLabel>
              <FormControl>
                <Input 
                disabled={isLoading}
                className="bg-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[1px] focus-visible:border-zinc-500 border-zinc-400 focus-visible:outline-none"
                {...field}
                />
              </FormControl>
            </FormItem>
          )}
          />
          </div>
          <DialogFooter className=" bg-zinc-300 pr-6 py-2">
            <Button 
            className="" 
            variant="secondary"
            disabled={isLoading}
            >
              Update</Button>
          </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditServer