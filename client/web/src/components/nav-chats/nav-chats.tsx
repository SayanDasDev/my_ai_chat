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
  }, [chatdata, setChats, chats]);

  return (
    <SidebarMenu className="mt-16">
      {isLoading && "Loading..."}
      {chats && <DataTable data={chats} />}
    </SidebarMenu>
  );
};

export default NavChats;
