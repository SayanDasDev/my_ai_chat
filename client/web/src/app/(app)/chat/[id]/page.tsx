"use client";
import MarkdownResponse from "@/components/markdown-response";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useFirstMessage } from "@/hooks/use-first-message";
import { useUserStore } from "@/hooks/use-user-store";
import { queryKeyStore } from "@/lib/query-key-store";
import { useChatId } from "@/lib/utils";
import { messageQuery } from "@/queries/message-queries";
import { Message } from "@/types/message";
import { useQuery } from "@tanstack/react-query";
import { Copy, Edit, RefreshCcw, Trash2 } from "lucide-react";
import React, { useEffect } from "react";

function ChatPage() {
  const { getAllMessages } = messageQuery();

  const chatId = useChatId();

  const {
    data: messages,
    isLoading,
    isError,
  } = useQuery<Message[]>({
    queryKey: [queryKeyStore.allMessages, chatId],
    queryFn: () => getAllMessages(chatId),
  });

  const responseActionIcons = [
    { icon: Copy, type: "Copy" },
    { icon: RefreshCcw, type: "Regenerate" },
  ];
  const promptActionIcons = [
    { icon: Edit, type: "Edit" },
    { icon: Trash2, type: "Delete" },
  ];

  const { user } = useUserStore();
  const { setIsFirstMessage } = useFirstMessage();

  useEffect(() => {
    if (messages && messages.length === 0) {
      setIsFirstMessage(true);
    } else {
      setIsFirstMessage(false);
    }
  }, [messages, isLoading, isError, setIsFirstMessage]);

  const sortedMessages = messages
    ?.slice()
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  return (
    <ChatMessageList className="h-full">
      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {!isLoading && !isError && messages && messages.length == 0 && (
        <EmptyState />
      )}
      {!isLoading &&
        !isError &&
        messages &&
        messages.length > 0 &&
        sortedMessages?.map((message, index) => {
          return (
            <React.Fragment key={message.id}>
              <ChatBubble className="items-end" variant="sent">
                <ChatBubbleAvatar
                  src={user?.avatar}
                  fallback={user?.initials}
                />
                <ChatBubbleMessage
                  className="bg-muted text-foreground"
                  variant="sent"
                >
                  {message.prompt}
                </ChatBubbleMessage>
                <ChatBubbleActionWrapper>
                  {promptActionIcons.map(({ icon: Icon, type }) => (
                    <ChatBubbleAction
                      className="size-7 text-muted-foreground"
                      key={type}
                      icon={<Icon className="size-4" />}
                      onClick={() =>
                        console.log(
                          "Action " + type + " clicked for message " + index
                        )
                      }
                    />
                  ))}
                </ChatBubbleActionWrapper>
              </ChatBubble>
              <ChatBubble className="items-end" layout="ai">
                <ChatBubbleAvatar className="mb-12" fallback={"AI"} />
                <ChatBubbleMessage className="w-[calc(100%-40px)] ">
                  {message.response === "Thinking..." ? (
                    <TextShimmer className="font-mono text-sm" duration={1}>
                      Thinking...
                    </TextShimmer>
                  ) : (
                    <MarkdownResponse>{message.response}</MarkdownResponse>
                  )}
                  <div className="mt-2 h-[25.5px]">
                    {responseActionIcons.map(({ icon: Icon, type }) => (
                      <ChatBubbleAction
                        className="size-6 text-muted-foreground"
                        key={type}
                        icon={<Icon className="size-3" />}
                        onClick={() =>
                          console.log(
                            "Action " + type + " clicked for message " + index
                          )
                        }
                      />
                    ))}
                  </div>
                </ChatBubbleMessage>
              </ChatBubble>
            </React.Fragment>
          );
        })}
    </ChatMessageList>
  );
}

export default ChatPage;

const EmptyState = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      <p className="text-3xl font-medium">What can I help you with?</p>
    </div>
  );
};

const ErrorState = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      <p className="text-3xl font-medium">Something went wrong!</p>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      <p className="text-3xl font-medium">Loading your messages.</p>
    </div>
  );
};
