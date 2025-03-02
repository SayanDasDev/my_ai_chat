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
import {
  cn,
  extractThoughtAndRest,
  parseResponsePattern,
  useChatId,
} from "@/lib/utils";
import { messageQuery } from "@/queries/message-queries";
import { Message } from "@/types/message";
import { useQuery } from "@tanstack/react-query";
import { Copy, Edit, FileText, RefreshCcw, Trash2 } from "lucide-react";
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
          const { filename, restOfString } = parseResponsePattern(
            message.response
          );

          const { thought, rest: response } =
            extractThoughtAndRest(restOfString);

          return (
            <React.Fragment key={message.id}>
              <section id={`latest-${index}`} />
              {filename && (
                <div className="ml-auto mr-14 translate-y-4 rounded-md gap-2 max-w-60 bg-muted border border-muted-foreground/10 px-4 py-2 grid grid-cols-[24px_1fr]">
                  <FileText className="text-muted-foreground" size={24} />
                  <p className="text-ellipsis line-clamp-1">{filename}</p>
                </div>
              )}
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
              <ChatBubble
                className={cn(
                  "items-start",
                  message.response === "Thinking..." && "h-[calc(100dvh-284px)]"
                )}
                layout="ai"
              >
                <ChatBubbleAvatar className="mt-4" fallback={"AI"} />
                <ChatBubbleMessage className="w-[calc(100%-40px)] ">
                  {message.response === "Thinking..." ? (
                    <TextShimmer className="font-mono text-sm" duration={1}>
                      Thinking...
                    </TextShimmer>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {thought && (
                        <div className="text-xs text-muted-foreground">
                          <div className="text-sm text-foreground">
                            Thoughts:
                          </div>
                          <div className="pl-2">
                            <MarkdownResponse>{thought}</MarkdownResponse>
                          </div>
                        </div>
                      )}
                      <MarkdownResponse>{response}</MarkdownResponse>
                    </div>
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
