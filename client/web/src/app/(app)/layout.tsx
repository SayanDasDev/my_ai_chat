"use client";
import ChatInput from "@/components/chat-input";
import FullScreenLoading from "@/components/full-screen-loading";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { assertAuthenticated, cn } from "@/lib/utils";
import { Share, SquarePen } from "lucide-react";
import Link from "next/link";
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

  if (isAuthenticating) {
    return <FullScreenLoading />;
  } else if (isAuthenticated) {
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
                      <Link
                        href={"/chat"}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "h-7 w-7"
                        )}
                      >
                        <SquarePen />
                        <span className="sr-only">Toggle Sidebar</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New Chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Separator orientation="vertical" className="mr-2 h-4" />
                {/* <ModelSelector /> */}
                {/* <PastAwareSwitch /> */}
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
            <ChatInput />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
}
