"use client"
import React, { ElementRef, useEffect, useRef } from 'react';

function Page() {
  const scrollRef = useRef<ElementRef<"div">>(null)
  if(scrollRef){
    console.log("hee");
  }

  useEffect(() => {
    const scrollDivRef = scrollRef?.current

    const handleScroll = () => {
      const topDiv = scrollDivRef?.scrollTop
      console.log(topDiv);
    }

    window.addEventListener("scroll", handleScroll)
  },[scrollRef, scrollRef.current])
  return (
    <div className="overflow-y-scroll h-[1900px]" ref={scrollRef}>
      <div className="h-[1900px]">
        Hello
      </div>

    </div>
  )
}

export default Page

