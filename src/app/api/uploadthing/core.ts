import { currentUser } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();
const handleAuth = async () => {
  const user = await currentUser();
  if(!user?.id) {
    throw new Error("Unauthorized!")
  }
  return {userId:user?.id};
}

export const ourFileRouter = {
  serverImage:f({ image:{ maxFileSize: "4MB", maxFileCount: 1}})
  .middleware(() => handleAuth())
  .onUploadComplete(() => {
    console.log("Server Image upload completed.");
  }),
  messageFile:f(["image", "pdf"])
  .middleware(() => handleAuth())
  .onUploadComplete(() => {
    console.log("Message file upload completed.");
  })

} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;