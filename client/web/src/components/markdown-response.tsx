"use client";
import Link from "next/link";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { Table, TableHead, TableHeader, TableRow } from "./ui/table";

const MarkdownResponse = ({ children }: { children: string }) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeKatex]}
      components={{
        table: ({ ...props }) => <Table {...props} />,
        thead: ({ ...props }) => <TableHeader {...props} />,
        tr: ({ ...props }) => <TableRow {...props} />,
        td: ({ ...props }) => <TableHead {...props} />,
        a: ({ href, ...props }) => (
          <Link className="text-blue-800" href={href as string} {...props} />
        ),
        ul: ({ ...props }) => (
          <ul
            className="space-y-1 text-foreground/80 list-disc list-inside"
            {...props}
          />
        ),
        ol: ({ ...props }) => (
          <ol className="space-y-1 list-decimal list-inside" {...props} />
        ),
        li: ({ ...props }) => <li className="" {...props} />,
        code: ({ ...props }) => (
          <code
            className="bg-muted text-sidebar-accent-foreground font-thin border rounded-sm px-2 py-px"
            {...props}
          />
        ),
        pre: ({ children, ...props }) => (
          <pre
            className="text-sm w-full sm:text-base inline-flex text-left items-center space-x-4 bg-muted text-sidebar-accent-foreground rounded-lg p-4 pl-6 mb-8 overflow-x-scroll"
            {...props}
          >
            <span className="flex gap-4">
              <span className="shrink-0"></span>

              <span className="flex-1">
                <span>{children}</span>
              </span>
            </span>
          </pre>
        ),
      }}
    >
      {children}
    </Markdown>
  );
};

export default MarkdownResponse;
