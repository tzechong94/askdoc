"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Loader2, MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { uploadToS3 } from "@/lib/s3";

import {
  blobToFile,
  createPdfFromText,
  pdfBufferToBlob,
  performOCR,
} from "./FileUpload";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleNewPdfClick = () => {
    document.getElementById("hiddenFileInput")?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files ? event.target.files[0] : null;
      if (!file) {
        toast.error("No file selected");
        return;
      }

      try {
        setLoading(true);
        let data: any = null;
        if (file.type.includes("pdf")) {
          data = await uploadToS3(file);
        } else {
          const text = await performOCR(file);
          console.log(text);
          const pdfBytes = await createPdfFromText(text);

          // Convert PDF buffer to Blob
          const pdfBlob = pdfBufferToBlob(pdfBytes);

          // Create File from Blob
          const pdfFile = blobToFile(pdfBlob, file.name.split(".")[0] + ".pdf");
          data = await uploadToS3(pdfFile);
        }
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }

        const response = await axios.post("/api/create-chat", {
          file_key: data.file_key,
          file_name: data.file_name,
        });

        if (response.data.chat_id) {
          toast.success("Chat created");
          router.push(`/chat/${response.data.chat_id}`);
        } else {
          toast.error("Error creating chat");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
          <div className="bg-white bg-opacity-80 p-4 rounded-lg">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-t text-sm text-slate-400">
              Reading your report...
            </p>
          </div>
        </div>
      )}
      <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
        <Button
          onClick={handleNewPdfClick}
          className="w-full border-dashed border-white border"
        >
          <PlusCircle className="mr-2 w-4 h-4" />
          New PDF
        </Button>
        {/* Hidden file input */}
        <input
          type="file"
          id="hiddenFileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".pdf, .jpeg, .jpg, .png"
        />
        <div className="flex flex-col gap-2 mt-4">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  "rounded-lg p-3 text-slate-300 flex items-center",
                  {
                    "bg-blue-600 text-white": chat.id === chatId,
                    "hover:text-white": chat.id !== chatId,
                  }
                )}
              >
                <MessageCircle className="mr-2" />
                <p className="text-xs w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.pdfName}
                </p>
              </div>
            </Link>
          ))}
          <Link href="/" className="absolute bottom-4 left-4">
            <Button className="w-full border-solid border-white border">
              <ArrowLeft className="" />
              Back
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChatSideBar;
