import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "2MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log(file);
      console.log(metadata);
    }
  ),

  variantUploader: f({ image: { maxFileSize: "2MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log(file);
      console.log(metadata);
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
