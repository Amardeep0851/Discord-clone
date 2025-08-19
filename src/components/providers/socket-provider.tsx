"use client"
import React, { 
  useContext, 
  createContext, 
  useEffect, 
  useState 
} from "react";
import {io as ClientIo} from "socket.io-client"

type SocketContextTypes = {
  socket:null | ReturnType<typeof ClientIo>;
  isConnected:boolean;
}

const SocketContext = createContext<SocketContextTypes>({
  socket:null,
  isConnected:false
});

export const useSocket = () => {
  return useContext(SocketContext);
}

export const SocketProvider = ({children}:{children:React.ReactNode}) => {
  const [socket, setSocket] = useState<null | ReturnType<typeof ClientIo>>(null);
  const [isConnected, setIsConnected] = useState(false);

  
  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    console.log("Socket connecting to:", siteUrl);

    if (!siteUrl) {
      console.error("NEXT_PUBLIC_SITE_URL is not set!");
      return;
    }
    const socketInstance = new (ClientIo as any)(siteUrl,
      {
        path:"/api/socket/io",
        addTrailingSlash:false
      }
    );

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    });
    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error:any) => {
      console.log("Socket connection error:", error);
    });

    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{isConnected, socket}} >
      {children}
    </SocketContext.Provider>
  )
}