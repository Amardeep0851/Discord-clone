import { useEffect, useState } from "react";

export const useOrigin = () => {
  
  const [Mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  },[])
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  if(!Mounted){
    return "";
  }

  return origin;
}