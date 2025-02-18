"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/hooks/use-user-store";
import Brand from "../brand";
import NavChats from "../nav-chats";
import { NavUser } from "../nav-user";
import { SearchChat } from "../search-chat";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="py-4">
        <Brand />
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SearchChat />
          <NavChats />
        </SidebarGroup>
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
