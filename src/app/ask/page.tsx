import SymptomsChat from "@/components/SymptomsChat";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  // const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  // if (!_chats) {
  //   return redirect("/");
  // }
  // if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
  //   return redirect("/");
  // }

  const isPro = await checkSubscription();

  // const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-[url('/images/HealthTalk.jpg')] overflow-y-scroll flex items-center justify-center">
      <div
        className="flex-1 max-w-6xl my-8 p-8 backdrop-filter backdrop-blur-lg bg-white/40 self-center"
        style={{ fontFamily: "sans-serif" }}
      >
        <Link href="/">
          <Button className="w-fit border-solid border-white border bg-color">
            <ArrowLeft className="" />
            Back
          </Button>
        </Link>

        {/* Title and Paragraph */}
        <div className="p-2">
          <h1 className="text-3xl font-bold mb-4">Ask AI-Doc</h1>
          <p className="leading-snug mb-3">
            Hello, I am your friendly healthcare companion! How can I assist you
            today?
            <br />
            Please feel free to share any symptoms or health concerns
            you&apos;re experiencing, and I&apos;ll do my best to provide some
            guidance. I can also help if you have any questions about specific
            medications you&apos;re not familiar with.
          </p>
          <p className="text-sm text-gray-900 font-semibold">
            Example: What are the symptoms for SARS-CoV-2?
          </p>
        </div>

        {/* Chat Component */}
        <div className="mx-auto my-4 p-2 bg-white rounded">
          <SymptomsChat />
        </div>

        {/* Fine Print */}
        <div className="p-2 text-sm">
          <p className="leading-snug mb-3">
            Disclaimer: Please note that the information provided here is for
            general knowledge and guidance purposes only. It is not a substitute
            for professional medical advice.
            <br />
            We strongly encourage you to consult a healthcare professional if
            you have any health concerns requiring personalized medical
            assistance.
          </p>
          <p className="font-semibold">
            Check out the links below for nearby clinics and healthcare
            facilities!
          </p>
          <a
            href="https://book.health.gov.sg/offerings/99/institutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 font-bold underline"
          >
            CHAS Clinic
          </a>{" "}
          &nbsp;
          <a
            href="https://singhealth.com.sg/rhs/find-a-gp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 font-bold underline"
          >
            SingHealth
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
