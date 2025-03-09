import {create} from "zustand";
import { Server, Channel, ChannelType } from "@prisma/client";

export type ModelType = 
| "createServer"
| "editServer"
| "deleteServer"
| "leaveServer"
| "createChannel"
| "editChannel" 
| "deleteChannel"
| "invitePeople"
| "managerMember"
| "messageFile"

interface ModelData {
  server?:Server;
  channel?:Channel;
  channelType?:ChannelType;
  apiUrl?:string;
  query?:Record<string, any>
}

interface ModelStore{
  type:ModelType | null;
  data:ModelData;
  isOpen:boolean;
  onOpen:(type:ModelType, data?:ModelData) => void;
  onClose:() => void;
}

export const useModel = create<ModelStore>((set) => ({
  type:null,
  data:{},
  isOpen:false,
  onOpen:(type, data={}) => set({isOpen:true, type, data}),
  onClose:() => set({isOpen:false, type:null})
}));