"use client"
import React from 'react'
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string"
import { useRouter } from "next/navigation";

import { Form,
  FormField,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import EmojiPicker from "./EmojiPicker";
import { useModel } from "@/store/useModelStore";


interface ChatInputProps{
  apiUrl:string;
  query:Record<string, any>;
  name:string;
  type:"conversation" | "channel";
}
const formSchema = z.object({
  content: z.string().min(1)
});
function ChatInput({apiUrl, query, name, type}:ChatInputProps) {
    const router = useRouter();
    const {onOpen} = useModel();
    const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      content:""
    }
  });
  

  const onSubmit = async (values:z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url:apiUrl,
        query
      })
      const response = await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log("[FRONTEND_CHAT_INPUT]", error);
    }
  }
  const isLoading = form.formState.isSubmitting;
  return (
    <div className="sticky bottom-0 left-0 right-0 w-full bg-inherit">
      <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <FormField 
        control={form.control}
        name="content"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <div className="m-4 mb-6 bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600 dark:text-zinc-200 flex flex-row items-center rounded-md py-1 px-3 ">
                <Button 
                variant="ghost"
                type="button"
                className="h-[24px] w-[24px] rounded-full bg-zinc-400  hover:bg-zinc-600 dark:bg-zinc-500 dark:hover:bg-zinc-400 p-1 flex items-center justify-center transition duration-300"
                onClick={() => onOpen("messageFile", {apiUrl, query})}
                >
                  <Plus className="text-white dark:text-[#313338] z-50"/>
                </Button>
                <Input 
                disabled={isLoading}
                className="bg-transparent dark:bg-transparent border-0 ring-0 outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                {...field}
                />
                <div className="">
                  <EmojiPicker
                    onChange={(emoji: string) =>
                      field.onChange(`${field.value}${emoji}`)
                    }
                  />
              </div>
              </div>
            </FormControl>
          </FormItem>
        )}
        />
      </form>
    </Form>
    </div>    
  )
}

export default ChatInput