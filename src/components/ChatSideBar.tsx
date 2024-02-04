"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { uploadToS3 } from "@/lib/s3";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleNewPdfClick = () => {
    document.getElementById('hiddenFileInput')?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files ? event.target.files[0] : null;
      if (!file) {
        toast.error("No file selected");
        return;
      }

      try {
        setLoading(true);
        const data = await uploadToS3(file);
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
    };

    }


  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
        <Button onClick={handleNewPdfClick} className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New PDF
        </Button>
      {/* Hidden file input */}
      <input
        type="file"
        id="hiddenFileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="application/pdf"
      />
      <div className="flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
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
  );
};

export default ChatSideBar;
