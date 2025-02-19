import { ChatInput as ShadcnChatInput } from "@/components/ui/chat/chat-input";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { Button } from "./ui/button";

const ChatInput = () => {
  return (
    <form className="mx-auto w-full max-w-screen-lg rounded-lg border bg-muted focus-within:ring-1 focus-within:ring-ring p-1">
      <ShadcnChatInput
        placeholder="Type your message here..."
        className="min-h-12 resize-none rounded-lg bg-muted border-0 p-3 shadow-none focus-visible:ring-0"
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

        <Button size="sm" className="ml-auto gap-1.5">
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
