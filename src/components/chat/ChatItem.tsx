import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserAvatar } from "@/components/user-avatar";
import qs from "query-string"
import {
  Ban,
  Edit,
  File,
  Loader2,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Trash,
} from "lucide-react";
import { Member, MemberRole, Message, Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem 
} from "../ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import ActionTooltip from "../ActionTooltip";
import axios from "axios";

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

interface ChatItemProps {
  name: string;
  content: string;
  fileUrl?: string | null;
  timestamp: string;
  deleted: boolean;
  isUpdated: boolean;
  currentMember: Member;
  imageUrl: string;
  messageMembr: Member;
  isEditing:string | null | undefined;
  handleMessageEditing:(id?:string | null | undefined) => void;
  messageId:string;
  memberRole:"ADMIN" | "MODERATE" | "GUEST";
  socketQuery:Record<string, string>;
  socketUrl:string;
}

const formSchema = z.object({
  content: z.string().min(1, { message: "Message is required." }),
});

function ChatItem({
  name,
  content,
  fileUrl,
  timestamp,
  deleted,
  isUpdated,
  currentMember,
  imageUrl,
  messageMembr,
  isEditing,
  messageId,
  handleMessageEditing,
  memberRole,
  socketQuery,
  socketUrl
}: ChatItemProps) {
 

  const router = useRouter();
  const params = useParams();
  const [loadingState, setLoadingState] = useState(false);
  const isAdmin = MemberRole.ADMIN === currentMember.role;
  const isModerate = MemberRole.MODERATE === currentMember.role;
  const isOwner = currentMember.role === memberRole;
  const isFile = !!fileUrl;
  const isPdf = isFile && content === "application/pdf";
  const isImage = isFile && !isPdf;
  const canEdit = isEditing === messageId && !deleted && !fileUrl && (isOwner) ;
  const canEditForMenu = !deleted && !fileUrl && (isOwner) ;
  const canDelete = !deleted && (isAdmin || isModerate || isOwner);

  const iconMap = {
    ADMIN:<ShieldAlert className="size-4 text-red-500" />,
    MODERATE:<ShieldCheck className="size-4" />,
    GUEST:null
    
  }
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    if(content){
      form.setValue("content",content);
    }
  }, [isEditing, content]);

  const onMemberClick = () => {
    if (messageMembr.profileId === currentMember.profileId) return null;
    router.push(`/servers/${params?.serverId}/conversation/${messageMembr.id}`);
  };

  const handleEditingCancel = () => {
    handleMessageEditing(null)
    router.refresh();
  }

  const handleMessageDelete = async () => {
    try {
      setLoadingState(true)
      const url = qs.stringifyUrl({
        url:`${socketUrl}/${messageId}`,
        query:socketQuery
      });
      await axios.delete(url)
    } catch (error) {
      console.error(error)
    }finally{
      setLoadingState(false)
    }
  };
  

  const editedFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoadingState(true)
      const url = qs.stringifyUrl({
        url:`${socketUrl}/${messageId}`,
        query:socketQuery
      });
      await axios.patch(url, values);
      handleEditingCancel();      
    } catch (error) {
      console.error(error)
    }finally{
      setLoadingState(false);
      form.reset();
    }
  };

  
  const isLoading = form.formState.isSubmitting;
  return (
    <div className={cn("flex flex-row group mt-2 pr-2 ")}>
      <div className="flex flex-row  w-full bg-zinc-900/5 group-hover:bg-black/10 rounded-md pt-1 pb-4 pl-2 transition duration-200 relative ">
        <div className="flex flex-row space-x-2 w-full">
          <div className="mt-1 cursor-pointer" onClick={onMemberClick}>
            <UserAvatar src={imageUrl} className="rounded-md" />
          </div>

          <div className="flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <p
                  className="font-semibold text-base cursor-pointer hover:underline text-zinc-800 dark:text-zinc-200"
                  onClick={onMemberClick}
                >
                  {name}
                </p>{" "}
                <ActionTooltip label={memberRole}>
                  {iconMap[memberRole]}
                </ActionTooltip>
                <p className="dark:text-zinc-400 text-zinc-600 text-xs">{isUpdated && !deleted && "Edited"}</p>
              </div>

              <div className="text-xs flex items-center dark:text-zinc-400 text-zinc-500 pr-2">
                {timestamp}
              </div>
            </div>

            <div className="pt-0.5">
              {isImage && (
                <div className="aspect-square relative mt-2 w-1/3 ">
                  <a href={fileUrl} rel="noopener noreferrer" target="_blank">
                    <Image
                      src={fileUrl}
                      fill
                      className="object-cover"
                      alt={content}
                    />
                  </a>
                </div>
              )}

              {isPdf && (
                <div>
                  <File className="size-8" />
                </div>
              )}
              {!fileUrl && !canEdit && <p 
                className={cn(
                "text-sm dark:text-zinc-300 text-zinc-700", 
                deleted && "italic text-xs dark:text-zinc-400 text-zinc-500")}>
                {
                isLoading 
                ? 
                (<Loader2 className="size-4 text-zinc-500 animate-spin" />) 
                : 
                content 
                }
                </p>
                }
                {canEdit && !fileUrl && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(editedFormSubmit)} className="pr-2 ">
                    <FormField
                      name="content"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea                          
                            className="text-white border-none focus-visible:ring-offset-0 focus-visible:ring-0 bg-black/15 " 
                            rows={4}
                            {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-4 pt-3 pr-1">
                      <Button 
                      size="sm" 
                      variant="secondary" 
                      type="button" 
                      onClick={handleEditingCancel}
                      disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button 
                      size="sm" 
                      variant="destructive" 
                      type="submit"
                      disabled={isLoading}>
                        Save
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
      {
      loadingState ?
      <Loader2 className="size-3 animate-spin" />
      :
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="invisible group-hover:visible">
          <Button
            variant="ghost"
            className={cn("hover:bg-transparent p-0 m-0 flex items-start outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0", !canEditForMenu && !canDelete && "cursor-not-allowed" )} >
            <MoreVertical className="size-6" />
            
          </Button>
        </DropdownMenuTrigger>
        {
          !deleted && (canDelete || canEditForMenu) && (
            <DropdownMenuContent side="left">
          {canEditForMenu && (
            <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleMessageEditing(messageId)}
          >
            <Edit className="size-3" /> Edit
          </DropdownMenuItem>
          )}
          {
            canDelete && (
              <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleMessageDelete} >
            <Trash className="size-3" />
            Delete
            </DropdownMenuItem>
            )
          }
        </DropdownMenuContent>
          )
        }
      </DropdownMenu>
      }
    </div>
  );
}

export default ChatItem;
