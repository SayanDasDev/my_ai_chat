import { ChatInput as ShadcnChatInput } from "@/components/ui/chat/chat-input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useChatStore } from "@/hooks/use-chat-store";
import { useFirstMessage } from "@/hooks/use-first-message";
import { queryKeyStore } from "@/lib/query-key-store";
import { useChatId } from "@/lib/utils";
import { messageQuery } from "@/queries/message-queries";
import { Message } from "@/types/message";
import { sendMessageSchema } from "@/types/schema/send-message-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CornerDownLeft, FileText, Mic, Paperclip, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import LoadingButton from "./ui/loading-button";

const ChatInput = () => {
  const chat_id = useChatId();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      chat_id,
      prompt: "",
      file: undefined,
    },
  });

  const { createMessage } = messageQuery();
  const { isFirstMessage } = useFirstMessage();
  const { clearChats } = useChatStore();

  const pathname = usePathname();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: [queryKeyStore.createMessage],
    mutationFn: (values: z.infer<typeof sendMessageSchema>) =>
      createMessage(values, isFirstMessage),
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({
        queryKey: [queryKeyStore.allMessages, chat_id],
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData([
        queryKeyStore.allMessages,
        chat_id,
      ]);

      let msg_length;

      // Optimistically update to the new value
      queryClient.setQueryData(
        [queryKeyStore.allMessages, chat_id],
        (old: Message[]) => {
          msg_length = old.length;

          return [
            ...old,
            {
              id: "**",
              chat_id: newMessage.chat_id,
              prompt: newMessage.prompt,
              response: "Thinking...",
              created_at: Date.now,
            },
          ];
        }
      );

      const url = pathname + `#latest-${msg_length}`;

      router.replace(url);
      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      toast.error("Something went wrong!");
      queryClient.setQueryData(
        [queryKeyStore.allMessages, chat_id],
        context?.previousMessages
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyStore.allMessages, chat_id],
      });
      form.reset({ chat_id, prompt: "" });
      clearChats();
      queryClient.invalidateQueries({
        queryKey: [queryKeyStore.allChats],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyStore.allMessages, chat_id],
      });
    },
  });

  function onSubmit(values: z.infer<typeof sendMessageSchema>) {
    mutate(values);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        form.handleSubmit(onSubmit)();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [form]);

  useEffect(() => {
    form.reset({ chat_id, prompt: "" });
  }, [router, form, chat_id]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative mx-auto w-full max-w-screen-lg rounded-lg border bg-muted focus-within:ring-1 focus-within:ring-ring p-1"
      >
        {form.watch("file") && (
          <div className="absolute -top-12 rounded-md gap-2 max-w-60 bg-muted border border-muted-foreground/10 px-4 py-2 grid grid-cols-[24px_1fr_12px]">
            <FileText className="text-muted-foreground" size={24} />
            <p className="text-ellipsis line-clamp-1">
              {form.getValues("file")?.name}
            </p>
            <Button
              onClick={() => form.setValue("file", undefined)}
              className="p-0 h-5 m-auto pt-px"
              variant={"ghost"}
            >
              <X className="text-muted-foreground" size={8} />
            </Button>
          </div>
        )}

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ShadcnChatInput
                  placeholder="Type your message here..."
                  className="min-h-12 resize-none rounded-lg bg-muted border-0 p-3 shadow-none focus-visible:ring-0"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex items-center p-3 pt-0">
          <FormField
            control={form.control}
            name="file"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...fieldProps}
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:bg-accent-foreground/10"
            onClick={handleFileButtonClick}
          >
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled
            className="hover:bg-accent-foreground/10"
            size="icon"
          >
            <Mic className="size-4" />
            <span className="sr-only">Use Microphone</span>
          </Button>

          <LoadingButton
            isLoading={isPending}
            disabled={!form.watch("prompt") || isPending}
            size="sm"
            className="ml-auto gap-1.5"
          >
            Send Message
            <CornerDownLeft className="size-3.5" />
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default ChatInput;
