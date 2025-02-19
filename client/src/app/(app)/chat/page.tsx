"use client";
import { Button } from "@/components/ui/button";
import { queryKeyStore } from "@/lib/query-key-store";
import { chatQuery } from "@/queries/chat-queries";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

function NewChatPage() {
  const router = useRouter();

  const { createChat } = chatQuery();

  const { mutate, isError, isPending, isSuccess } = useMutation({
    mutationKey: [queryKeyStore.createChat],
    mutationFn: createChat,
    onMutate: () => {
      const toastId = toast.loading("Creating Chat");
      return { toastId };
    },
    onError: (error, variables, context) => {
      toast.error("Something went wrong!", {
        id: context?.toastId,
      });
    },
    onSuccess: (data, variables, context) => {
      router.push(`/chat/${data.id}`);
      toast.success("New Chat Created!", {
        id: context?.toastId,
      });
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      {isError ? (
        <X size={32} className="mr-2" />
      ) : (
        <Loader2Icon size={32} className="mr-2 animate-spin" />
      )}
      {isPending && `Creating New Chat`}
      {isError && (
        <>
          <p>Something Went Wrong</p>
          <Button onClick={() => mutate()}>New Chat</Button>
        </>
      )}
      {isSuccess && `Redirecting to new chat`}
    </div>
  );
}

export default NewChatPage;
