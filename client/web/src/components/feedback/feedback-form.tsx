"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryKeyStore } from "@/lib/query-key-store";
import { feedbackQuery } from "@/queries/feedback-queries";
import { feedbackSchema } from "@/types/schema/feedback-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingButton from "../ui/loading-button";

export function FeedbackForm({
  message_id,
  setOpen,
}: {
  message_id: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      message_id: message_id,
      feedback: "",
      rating: 1,
    },
  });

  const queryClient = useQueryClient();

  const { createFeedback } = feedbackQuery();

  const { mutate, isPending } = useMutation({
    mutationKey: [queryKeyStore.createFeedback],
    mutationFn: createFeedback,
    onMutate: () => {
      const toastId = toast.loading("Creating Feedback");
      return { toastId };
    },
    onError: (error, variables, context) => {
      toast.error("Something went wrong!", {
        id: context?.toastId,
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyStore.topMessages],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeyStore.bottomMessages],
      });
      toast.success("New Feedback Added!", {
        id: context?.toastId,
      });
    },
  });

  function onSubmit(data: z.infer<typeof feedbackSchema>) {
    // toast.success(JSON.stringify(data, null, 2));
    mutate(data);
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FeedBack</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Write Something"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Write a number between 1-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton isLoading={isPending} disabled={isPending} type="submit">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
