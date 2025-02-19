import { ChatInput as ShadcnChatInput } from "@/components/ui/chat/chat-input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { queryKeyStore } from "@/lib/query-key-store";
import { useChatId } from "@/lib/utils";
import { messageQuery } from "@/queries/message-queries";
import { sendMessageSchema } from "@/types/schema/send-message-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "./ui/button";
import LoadingButton from "./ui/loading-button";

const ChatInput = () => {
  const chat_id = useChatId();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof sendMessageSchema>>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      chat_id,
      prompt: "",
    },
  });

  const { createMessage } = messageQuery();

  const { mutate, isPending } = useMutation({
    mutationKey: [queryKeyStore.createMessage],
    mutationFn: createMessage,
    onMutate: () => {},
    onError: () => {
      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyStore.allMessages, chat_id],
      });
      form.reset({ prompt: "" });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-screen-lg rounded-lg border bg-muted focus-within:ring-1 focus-within:ring-ring p-1"
      >
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
          <Button variant="ghost" size="icon">
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Mic className="size-4" />
            <span className="sr-only">Use Microphone</span>
          </Button>

          <LoadingButton
            isLoading={isPending}
            disabled={!form.watch("prompt")}
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
