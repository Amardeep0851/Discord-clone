"use client"

import React from 'react'

import { useSocket } from "../providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
function SocketIndicator() {

  const {isConnected, socket} = useSocket();
  return (
    <Badge 
    className={cn("text-white border-none", 
      !isConnected ? "bg-rose-700 hover:bg-rose-600" : "bg-emerald-600 hover:bg-emerald-600", )}
    variant="outline" >
      {
      isConnected 
      ? "Live: Real-time updates" 
      : "Fallback: Polling every 1s"
      }
    </Badge>
  )
}

export default SocketIndicator