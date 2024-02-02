import ChatComponent from "@/components/ChatComponent";
import SymtomCheckerHistory from "@/components/SymtomCheckerHistory";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const isPro = await checkSubscription();

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <SymtomCheckerHistory
            chats={_chats}
            chatId={parseInt(chatId)}
            isPro={isPro}
          />
        </div>

        {/* Content Section */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          {/* Title and Paragraph */}
          <div className="p-4">
            <h1 className="text-2xl font-bold">Symptoms Checker</h1>
            <p className="text-gray-600">
              Feel free to ask questions you are interested in!
              <br />
              For Example: What is Jaundice ?<br />
              What should I do if I caught a cold?
            </p>
          </div>

          {/* Chat Component */}
          <div>
            <ChatComponent chatId={parseInt(chatId)} />
          </div>

          {/* Fine Print */}
          <div className="p-4 text-sm text-gray-500">
            <p>
              Disclaimer: This is not professional medical advice! Do visit the
              doctor if needed!
              <br />
              Check out the links below for nearby clinics!
            </p>
            <a
              href="https://book.health.gov.sg/offerings/99/institutions"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              CHAS Clinic
            </a>{" "}
            &nbsp;
            <a
              href="https://singhealth.com.sg/rhs/find-a-gp"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              SingHealth
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
