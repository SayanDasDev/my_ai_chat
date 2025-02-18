import { Loader2Icon } from "lucide-react";

function NewChatPage() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Loader2Icon size={32} className="mr-2 animate-spin" />
      Creating New Chat
    </div>
  );
}

export default NewChatPage;
