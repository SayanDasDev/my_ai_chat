"use client";

import { SidebarMenu } from "@/components/ui/sidebar";
import { useChatStore } from "@/hooks/use-chat-store";
import { queryKeyStore } from "@/lib/query-key-store";
import { chatQuery } from "@/queries/chat-queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { DataTable } from "./data-table";

const NavChats = () => {
  const { getAllChats } = chatQuery();

  const { chats, setChats } = useChatStore();

  const { data: chatdata, isLoading } = useQuery({
    queryKey: [queryKeyStore.allChats],
    queryFn: getAllChats,
    enabled: !chats,
  });

  useEffect(() => {
    if (chatdata) {
      setChats(chatdata);
    }
  }, [chatdata, setChats]);

  return (
    // <SidebarGroup>
    //   <SidebarGroupLabel>Projects</SidebarGroupLabel>
    <SidebarMenu className="mt-16">
      {isLoading && "Loading..."}
      {/* {!isLoading &&
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
        ))} */}
      {!isLoading && chats && <DataTable data={chats} />}
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
