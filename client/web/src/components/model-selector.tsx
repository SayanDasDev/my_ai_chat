"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import React from "react";

const ModelSelector = () => {
  const [model, setModel] = React.useState("gemini-2.0");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-left hover:bg-muted py-1 px-2 rounded">
        <div className="text-xs text-foreground/50">Current Model</div>
        <div className="font-medium flex items-center gap-1">
          {model} <ChevronDown className="text-foreground/50 mt-1" size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-sidebar" align="start">
        <DropdownMenuLabel className="text-xs text-foreground/50 font-light">
          Select Model
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
          <DropdownMenuRadioItem value="gemini-2.0">
            Gemini 2.0
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="deepseek-r1">
            Deepseek r1
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSelector;
