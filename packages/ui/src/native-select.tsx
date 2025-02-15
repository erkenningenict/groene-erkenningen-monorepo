"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@repo/ui/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode;
};

const NativeSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center cursor-pointer">
      <select
        {...props}
        className={cn(
          `[grid-area:stack] appearance-none h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 pr-8`,
          props.className,
        )}
      >
        {props.children}
      </select>

      <div className="[grid-area:stack] justify-self-end pointer-events-none bg-background pr-3 mr-[1px]">
        <ChevronDown className="h-4 w-4 bg-inherit text-muted-foreground" />
      </div>
    </div>
  );
};

export { NativeSelect };
