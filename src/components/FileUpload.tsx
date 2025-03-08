import { UploadButton, UploadDropzone } from "@/config/uploadthing";
import { X, File, Trash } from "lucide-react";
import Image from "next/image";
import React, { useState } from 'react';
import "@uploadthing/react/styles.css";


type FileUploadProps = {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange:(url?:string) => void;
}

function FileUpload({endpoint, value, onChange}:FileUploadProps) {
  const fileType = value?.split(".").pop()?.toLowerCase();
  
  if(value && fileType !== "pdf"){
    return (
    <>
      <div className="w-20 h-20 relative">
      <Image src={value} alt="Uploaded Image" fill className="rounded-full" />
      <button  type="button" 
      className="absolute top-0 right-0 z-30 rounded-full cursor-pointer" 
      onClick={() => {
        return onChange("");
        }}>
        <X className="h-5 w-5 bg-black text-white rounded-lg" />
      </button>
      </div>
      
    </>
    )
  }

  if(value && fileType === "pdf"){
    return (
      <>
      <div className="w-20 h-20 relative">
        <File className="w-20 h-20 " />
        <button  type="button" 
      className="absolute -top-1 right-1 z-30 rounded-full cursor-pointer" 
      onClick={() => {      
        return onChange("");
        }}>
        <X className="h-6 w-6 bg-black text-white rounded-md" />
      </button>
      </div>
      </>
    )
  }

  return (
    <>
    <UploadDropzone 
    endpoint={endpoint}
    onClientUploadComplete={(res) => {
      onChange(res?.[0]?.url);
      console.log(res?.[0]?.url);
    }}
    onUploadError={(error:Error) => console.error(error.message)}
    />
    </>
  )
  
}

export default FileUpload