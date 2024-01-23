import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
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
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">
              AskDoc about your report
            </h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-2">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Ask Now <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                {/* <div className="ml-3">
                  <SubscriptionButton isPro={isPro} />
                </div> */}
              </>
            )}
          </div>
          <p className="max-w-full mt-1 text-lg text-slate-600 mt-4">
            At AskDoc, we&apos;ve harnessed the power of artificial intelligence
            to revolutionize the way you interact with your health reports. Our
            cutting-edge AI technology reads and analyzes your medical reports,
            providing you with valuable insights and facilitating personalized
            health conversations.
          </p>
          <div className="w-full mt-4">
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
        </div>
      </div>
    </div>
  );
}
