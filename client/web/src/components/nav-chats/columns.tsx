"use client";

import { Chat } from "@/hooks/use-chat-store";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Forward, MoreHorizontal, Pen, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  useSidebar,
} from "../ui/sidebar";

export const columns: ColumnDef<Chat>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "name",
    cell: ({ row }) => (
      <NavChatElement chatId={row.getValue("id")} name={row.getValue("name")} />
    ),
  },
  {
    accessorKey: "created_at",
    enableSorting: true,
  },
];

const NavChatElement = ({ chatId, name }: { chatId: string; name: string }) => {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  return (
    <>
      <SidebarMenuButton
        className={cn(
          pathname.includes(chatId) &&
            "bg-sidebar-accent/50 text-sidebar-accent-foreground"
        )}
        asChild
      >
        <a href={`/chat/${chatId}`}>
          <span>{name}</span>
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
    </>
  );
};
