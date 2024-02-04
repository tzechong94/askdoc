import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;

  const bubbleStyle = {
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    maxWidth: '80%'
  };

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => {
        const isUserMessage = message.role === "user";
        return (
          <div
            key={message.id}
            className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
            <div
              style ={{
                ...bubbleStyle,
                backgroundColor: isUserMessage ? '#1D4ED8' : '#F3F4F6',
                color: isUserMessage ? 'white' : 'black',
                textAlign: isUserMessage ? 'right' : 'left',
              }}
            >
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
