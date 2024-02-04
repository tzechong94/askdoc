import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn, Space } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";

export default async function Home() {
  const { userId } = await auth();
  console.log(userId, "userid");
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center ">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-bold mb-6">AskDoc</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <p className="max-w-full mt-1 text-lg text-slate-600 mt-4">
            {isAuth
              ? "Welcome! Explore your health insights by asking AI-Doc for personalized advice about your health concerns, symptoms, and medication queries. " +
                "AskDoc, a combination of 'Doctor' and 'Document', is a wordplay that embodies our unique approach in using interactive AI to revolutionize " +
                "the way you interact with your medical documents. Go on, we accept documents in PDF or images in JPG and PNG!"
              : "At AskDoc, we've harnessed the power of artificial intelligence to make healthcare communication more accessible and informative than ever before. " +
                "Our cutting-edge AI technology reads and analyzes your medical reports, providing you with valuable insights and facilitating personalized " +
                "health conversations. Your health journey has never been more accessible, informative, and engaging!"}
          </p>
          <div className="w-full mt-8">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
          <div className="flex mt-8">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Retrieve Doc <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                &nbsp;
                <Link href={`/ask`}>
                  <Button>
                    Ask AI-Doc <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                {/* <div className="ml-3">
                  <SubscriptionButton isPro={isPro} />
                </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
