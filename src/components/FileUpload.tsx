import { UploadButton, UploadDropzone } from "@/config/uploadthing";
import { X, File, Trash } from "lucide-react";
import Image from "next/image";
import React, { useState } from 'react';
import "@uploadthing/react/styles.css";


type FileUploadProps = {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange:(url?:string, fileType?:string | undefined) => void;
}

function FileUpload({endpoint, value, onChange}:FileUploadProps) {
  const [uploadedFileType, setUploadedFileType] = useState<string | undefined>();
  if(value && uploadedFileType !== "application/pdf"){
    console.log("file is image");
    return (
    <div className="w-full flex justify-center">
      <div className="w-20 h-20 relative">
      <Image src={value} alt="Uploaded Image" fill className="rounded-full" />
      <button  type="button" 
      className="absolute top-0 right-0 z-30 rounded-full cursor-pointer" 
      onClick={() => {
        return onChange("", undefined);
        }}>
        <X className="h-5 w-5 bg-black text-white rounded-lg" />
      </button>
      </div>
      
    </div>
    )
  }

  if(value && uploadedFileType === "application/pdf"){
    return (
      <div className="flex justify-center">
      <div className="w-20 h-20 relative ">
        <File className="w-20 h-20 " />
        <button  type="button" 
      className="absolute -top-1 right-1 z-30 rounded-full cursor-pointer" 
      onClick={() => {      
        return onChange("", undefined);
        }}>
        <X className="h-6 w-6 bg-black text-white rounded-md" />
      </button>
      </div>
      </div>
    )
  }

  return (
    <>
    <UploadDropzone 
    endpoint={endpoint}
    onClientUploadComplete={(res) => {   
        onChange(res?.[0]?.url,res?.[0]?.type || undefined);
        setUploadedFileType(res?.[0]?.type)
    }}
    onUploadError={(error:Error) => console.error(error.message)}
    />
    </>
  )
  
}

export default FileUpload