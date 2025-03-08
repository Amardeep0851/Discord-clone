import {Server as NetServer} from "http";
import {Server as ServerIo} from "socket.io";
import { NextApiRequest } from "next";

import { NextResponseWithServerIo } from '@/config/typescript-types';

export const config = {
  api:{
    bodyParser:false,
  },
}

const ioHandler = (req:NextApiRequest, res:NextResponseWithServerIo) =>{
  console.log("before Initializing Socket.io server...");

  if(!res.socket.server.io){
    console.log("Initializing Socket.io server...");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIo(httpServer, {
      path:"/api/socket/io",
      // @ts-ignore
      addTrailingSlash: false,
      cors: {
        origin: "*", // Replace with your frontend URL in production
        methods: ["GET", "POST"],
      },
    });
    res.socket.server.io = io
  }
  else{
    console.log("Socket.io server already initialized.");
  }
  res.end();
}


export default ioHandler