"use client";

import { Chat } from "@/hooks/use-chat-store";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Forward, MoreHorizontal, Pen, Trash, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import CrudButton from "../ui/crud-button";
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
import DeleteChatForm from "./delete-chat-form";

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

  const [openDelete, setOpenDelete] = useState(false);

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
          {/* <DropdownMenuItem>
            <Trash2 className="text-muted-foreground" />
            <span>Delete Chat</span>
          </DropdownMenuItem> */}
          <CrudButton
            title="Delete Chat"
            showTitle={false}
            open={openDelete}
            setOpen={setOpenDelete}
            description={<DeleteDescription />}
            form={<DeleteChatForm setOpen={setOpenDelete} id={chatId} />}
          >
            <Button className="w-full justify-start px-2" variant={"ghost"}>
              <Trash size={16} />
              <p className="max-sm:sr-only">Delete</p>
            </Button>
          </CrudButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const DeleteDescription = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-4">
      <Trash2 className="size-12 text-gray-500" />
      Are you sure you want to delete this item?
    </div>
  );
};
