import { Member, Profile, Server } from "@prisma/client";
import { NextApiResponse } from "next";
import type { Server as NetServer, Socket as NetSocket } from "net"
import {Server as ServerIo} from "socket.io";
export type ServerWithMembersWithProfiles = Server & {
  members:(Member & {profile:Profile})[]
}

export type NextResponseWithServerIo = NextApiResponse & {
  socket:NetSocket &{ server:NetServer & {io:ServerIo}}
}