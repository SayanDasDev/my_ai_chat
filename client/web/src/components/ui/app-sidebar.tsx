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
import Brand from "../brand";
import NavChats from "../nav-chats/nav-chats";
import { NavUser } from "../nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="py-4">
        <Brand />
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup className="relative">
          <div className="bg-sidebar h-16 fixed top-12 z-10 w-[239]" />
          <SidebarGroupLabel className="fixed top-[56px] z-10">
            Chats
          </SidebarGroupLabel>
          <NavChats />
        </SidebarGroup>
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
