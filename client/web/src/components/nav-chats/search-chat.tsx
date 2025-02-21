"use client";

import { Input } from "@/components/ui/input";
import { Chat } from "@/hooks/use-chat-store";
import { Table } from "@tanstack/react-table";
import { LoaderCircle, Search, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

const SearchChat = ({ table }: { table: Table<Chat> }) => {
  const id = useId();
  const [inputValue, setInputValue] = useState(
    (table.getColumn("name")?.getFilterValue() as string) ?? ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [table, inputValue]);

  return (
    <div className="fixed z-10 top-[84px] w-[239] bg-sidebar">
      <div className="relative">
        <Input
          id={id}
          className="peer pe-9 ps-9 bg-muted"
          placeholder="Search..."
          type="search"
          value={inputValue}
          onChange={(e) => {
            table.getColumn("name")?.setFilterValue(e.target.value);
            setInputValue(e.target.value);
          }}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          {isLoading ? (
            <LoaderCircle
              className="animate-spin"
              size={16}
              strokeWidth={2}
              role="status"
              aria-label="Loading..."
            />
          ) : (
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </div>
        {inputValue.length > 0 && (
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="clear"
            onClick={() => {
              setInputValue("");
              table.getColumn("name")?.setFilterValue("");
            }}
            type="button"
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export { SearchChat };
