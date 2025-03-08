import React from 'react';

import { Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
 } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NavigationSidebar from "./NavigationSidebar/NavigationSidebar";
import ServerSidebar from "./server-sidebar/ServerSidebar";
import { Button } from "@/components/ui/button";

function MobileToggle({serverId}:{serverId:string}) {
  return (
    <Sheet >
      <SheetTrigger className="mr-3" asChild>
        <Button variant="ghost" size="icon" className=" md:hidden">
        <Menu  />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 gap-0 md:hidden" >
        <SheetHeader>
          <SheetTitle className="h-12">
            
          </SheetTitle>
        </SheetHeader>
        <div className="flex">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>  
          <ServerSidebar serverId={serverId} />

        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle