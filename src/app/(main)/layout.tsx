import NavigationSidebar from "@/components/NavigationSidebar/NavigationSidebar"
import React from 'react';

function layout({children}:{children:React.ReactNode}) {

  return (
    <div className="h-full flex flex-row">
    <div className="invisible md:visible md:block">
    <div className="w-[72px] h-full z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
    </div>
    
    <main className="min-h-screen h-full md:ml-[72px] w-full ">{children}</main>
    </div>
  )
}

export default layout