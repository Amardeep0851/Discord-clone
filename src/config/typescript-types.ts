import { Member, Profile, Server } from "@prisma/client";
import type { Server as NetServer, Socket as NetSocket } from "net"
import {Server as ServerIo} from "socket.io";
import { NextApiResponse } from "next";
export type ServerWithMembersWithProfiles = Server & {
  members:(Member & {profile:Profile})[]
}

export type NextResponseWithServerIo = NextApiResponse & {
  socket:NetSocket &
  { server:NetServer & 
    {io?:ServerIo
    }
  }
}