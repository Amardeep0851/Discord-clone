import {Server as NetServer} from "https";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextResponseWithServerIo } from '@/config/typescript-types';

export const config = {
  api:{
    bodyParse:false
  }
}

const ioHandler = (req:NextApiRequest, res:NextResponseWithServerIo ) => {
  if(!res.socket.server.io){
    const path = "/api/socket/io";
    const httpServer:NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      //@ts-ignore
      addTrailingSlash:false
    })
    res.socket.server.io = io
  }

  res.end();
}

export default ioHandler