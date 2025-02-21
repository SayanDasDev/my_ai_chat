"use client";

import { Chat } from "@/hooks/use-chat-store";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { SidebarMenuItem } from "../ui/sidebar";
import { columns } from "./columns";
import { SearchChat } from "./search-chat";

export function DataTable({ data }: { data: Chat[] }) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      created_at: false,
    });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
    initialState: {
      sorting: [
        {
          id: "created_at",
          desc: true,
        },
      ],
    },
  });

  return (
    <>
      <SearchChat table={table} />

      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <SidebarMenuItem key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <React.Fragment key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </React.Fragment>
            ))}
          </SidebarMenuItem>
        ))
      ) : (
        <p>No chat found</p>
      )}
    </>
  );
}
