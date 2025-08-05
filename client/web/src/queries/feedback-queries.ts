import { useTokenStore } from "@/hooks/use-token-store";
import { BACKEND_URL, ensureAuthenticated } from "@/lib/utils";
import { feedbackSchema } from "@/types/schema/feedback-schema";
import { z } from "zod";

export const feedbackQuery = () => {
  const { accessToken } = useTokenStore.getState();

  const createFeedback = async (values: z.infer<typeof feedbackSchema>) => {
    await ensureAuthenticated();

    const response = await fetch(`${BACKEND_URL}/feedback/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  type Feedback = {
    id: string;
    message_id: string;
    feedback: string;
    rating: number;
    message_prompt: string;
    message_response: string;
    user_id: string;
    created_at: string;
  };

  const getFeedbacks = async (
    side: "top" | "bottom",
    number: number
  ): Promise<Feedback[]> => {
    await ensureAuthenticated();

    const response = await fetch(
      `${BACKEND_URL}/feedback/query?${side}=${number}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };
  return { createFeedback, getFeedbacks };
};
