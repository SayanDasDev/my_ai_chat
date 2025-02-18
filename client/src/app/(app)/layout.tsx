"use client";
import FullScreenLoading from "@/components/full-screen-loading";
import ModelSelector from "@/components/model-selector";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/hooks/use-user-store";
import { queryKeyStore } from "@/lib/query-key-store";
import { assertAuthenticated } from "@/lib/utils";
import { authQuery } from "@/queries/auth-queries";
import { useQuery } from "@tanstack/react-query";
import { CornerDownLeft, Mic, Paperclip, Share, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await assertAuthenticated();
      setIsAuthenticated(authenticated);
      setIsAuthenticating(false);
      if (!authenticated) {
        router.push("/login");
      }
    };

    checkAuthentication();
  }, [router]);

  const { getUser } = authQuery();

  const { data, isLoading } = useQuery({
    queryKey: [queryKeyStore.getUser],
    queryFn: getUser,
  });

  const { setUser } = useUserStore();

  useEffect(() => {
    if (data) {
      setUser(data);
      console.log(data);
    }
  }, [data, setUser]);

  if (isAuthenticating || isLoading) {
    return <FullScreenLoading />;
  } else if (isAuthenticated || data) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-sidebar/75">
          <header className="z-10 fixed top-0 w-full md:w-[calc(100%-255px)] backdrop-blur-md flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex w-full gap-2 px-4">
              <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className={"h-7 w-7"}>
                        <SquarePen />
                        <span className="sr-only">Toggle Sidebar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New Chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <ModelSelector />
              </div>
              <Button variant={"ghost"}>
                <Share size={4} />
                Share
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col mt-16 mb-[110px] gap-4 p-4 pt-0 max-w-screen-lg w-full mx-auto ">
            {children}
          </div>
          <div className="fixed w-full px-2 md:w-[calc(100%-255px)] bottom-2 [box-shadow:_0px_10px_0px_0px_rgba(28,28,31,1);]">
            <form className="mx-auto w-full max-w-screen-lg rounded-lg border bg-muted focus-within:ring-1 focus-within:ring-ring p-1">
              <ChatInput
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
            {/* <div className="bg-[#1c1c1f] h-2" /> */}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
}
