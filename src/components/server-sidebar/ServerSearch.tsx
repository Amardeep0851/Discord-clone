"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, redirect } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandGroup,
  Command,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog"; 
import { Search } from "lucide-react";

interface ServerSerachProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          id: string;
          name: string;
          icon: React.ReactNode;
        }[]
      | undefined;
  }[];
}

function ServerSearch({ data }: ServerSerachProps) {
  const [openCommandDialog, setOpenCommandDialog] = useState(false);
  const router = useRouter();
  const params = useParams();
  const onButtonClick = () => {
    setOpenCommandDialog(true)
  }
  const onSearchClose = () => {
    setOpenCommandDialog(false)
  }

  const onClickOpen = (id:string, type:string) => {
    setOpenCommandDialog(false)
    if(type === "channel"){
      router.push(`/servers/${params?.serverId}/channel/${id}`);
    }
    if(type === "member"){
      router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
  }

  useEffect(() => {

    const handlekeyDown = (e:KeyboardEvent) => {
      if((e.ctrlKey || e.metaKey) && e.key === "q"){
        e.preventDefault();
        setOpenCommandDialog(true)
      }
    }

    window.addEventListener("keydown", handlekeyDown);
  })
  return (
    <>
      <button onClick={onButtonClick} className="group flex justify-between w-full gap-2 p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded transition border-[1px] border-zinc-200 dark:border-zinc-700">
        <p className="flex items-center gap-2">
          <Search className="size-4" /> <span className="font-semibold">Search</span>
        </p>
        <kbd className="text-sm rounded py-0.5 px-1 bg-zinc-200 group-hover:bg-zinc-300 text-zinc-700 dark:text-white dark:bg-zinc-900 dark:group-hover:bg-zinc-900 font-semibold ">ctrl+q</kbd>
      </button>
      <CommandDialog open={openCommandDialog} onOpenChange={onSearchClose} >
        <DialogTitle className="text-center pt-4 pb-4 mx-4 mb-2 border-b-[1px] border-zinc-700">
          Search Server
        </DialogTitle>

        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No result found.</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) {
              return null;
            }
            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, name, icon }) => (
                  <CommandItem 
                  key={id} 
                  className="cursor-pointer"
                  onSelect={() => onClickOpen(id, type)}
                  > 
                  {icon} {name}
                   </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default ServerSearch;
