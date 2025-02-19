"use client";

import { Forward, MoreHorizontal, Pen, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/hooks/use-chat-store";
import { queryKeyStore } from "@/lib/query-key-store";
import { cn } from "@/lib/utils";
import { chatQuery } from "@/queries/chat-queries";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const NavChats = () => {
  const { isMobile } = useSidebar();

  const { getAllChats } = chatQuery();

  const { chat: chats, setChat } = useChatStore();

  const { data: chatdata, isLoading } = useQuery({
    queryKey: [queryKeyStore.allChats],
    queryFn: getAllChats,
    enabled: !chats,
  });

  useEffect(() => {
    if (chatdata) {
      setChat(chatdata);
    }
  }, [chatdata, setChat]);

  const pathname = usePathname();

  return (
    // <SidebarGroup>
    //   <SidebarGroupLabel>Projects</SidebarGroupLabel>
    <SidebarMenu className="mt-2">
      {isLoading && "Loading..."}
      {!isLoading &&
        chats?.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              className={cn(
                pathname.includes(item.id) &&
                  "bg-sidebar-accent/50 text-sidebar-accent-foreground"
              )}
              asChild
            >
              <a href={`/chat/${item.id}`}>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Pen className="text-muted-foreground" />
                  <span>Edit Name</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Chat</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
    </SidebarMenu>
    // </SidebarGroup>
  );
};

export default NavChats;
