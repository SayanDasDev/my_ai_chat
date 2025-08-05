import { queryKeyStore } from "@/lib/query-key-store";
import { cn } from "@/lib/utils";
import { feedbackQuery } from "@/queries/feedback-queries";
import { Tooltip } from "@radix-ui/react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { buttonVariants } from "./ui/button";
import { Icons } from "./ui/icons";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "./ui/responsive-modal";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";

const TopMessagesBtn = () => {
  const { getFeedbacks } = feedbackQuery();

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeyStore.topMessages],
    queryFn: () => getFeedbacks("top", 5),
  });

  return (
    <ResponsiveModal>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveModalTrigger
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-7 w-7"
            )}
          >
            <Icons.topChat className="size-4" />
          </ResponsiveModalTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Top Messages</p>
        </TooltipContent>
      </Tooltip>
      <ResponsiveModalContent size="lg">
        <ResponsiveModalTitle>Top Messages</ResponsiveModalTitle>

        {isLoading && <div className="text-center">Loading...</div>}
        {isError && <div className="text-center text-red-500">Error!</div>}
        {data && (
          <div className="space-y-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg shadow-sm bg-muted"
              >
                <div className="text-sm text-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </div>
                <div className="mt-2">
                  <div className="font-semibold">Prompt:</div>
                  <div className="text-muted-foreground">
                    {item.message_prompt}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="font-semibold">Response:</div>
                  <div className="text-muted-foreground whitespace-pre-line line-clamp-3">
                    {item.message_response}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="font-semibold">Feedback:</div>
                  <div className="text-muted-foreground">{item.feedback}</div>
                </div>
                <div className="mt-2">
                  <div className="font-semibold">Rating:</div>
                  <div className="text-muted-foreground">{item.rating}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default TopMessagesBtn;
