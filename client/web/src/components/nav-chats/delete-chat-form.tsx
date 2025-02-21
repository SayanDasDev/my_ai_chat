"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { useChatStore } from "@/hooks/use-chat-store";
import { queryKeyStore } from "@/lib/query-key-store";
import { chatQuery } from "@/queries/chat-queries";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ResponsiveModalClose } from "../ui/responsive-modal";

const DeleteChatForm = ({
  id,
  setOpen,
}: {
  id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();

  const form = useForm();

  const { deleteChat } = chatQuery();

  const { chats, clearChats } = useChatStore();

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: [queryKeyStore.deleteChat],
    mutationFn: deleteChat,
    onMutate: () => ({}),
    onError: () => {
      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      clearChats();
      queryClient.invalidateQueries({
        queryKey: [queryKeyStore.allChats],
      });
      setOpen(false);
      // TODO: bug when deleting top element
      if (chats && chats.length > 0) {
        router.push(`/chat/${chats[0].id}`);
      } else {
        router.push(`/chat`);
      }
    },
  });

  function onSubmit() {
    if (!id) {
      toast.error("Can't find chat!");
    }
    mutate(id);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
        <div className="flex justify-center items-center space-x-4">
          <ResponsiveModalClose
            data-modal-toggle="deleteModal"
            type="button"
            className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            No, cancel
          </ResponsiveModalClose>
          <LoadingButton
            isLoading={isPending}
            type="submit"
            className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Yes, I&apos;m sure
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default DeleteChatForm;
