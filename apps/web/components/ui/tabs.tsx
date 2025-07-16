"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground w-fit flex flex-col items-center justify-center rounded-lg  relative",
        className,
      )}
      {...props}
    >
      <div className="inline-flex w-full">{children}</div>
      <hr className="w-full" />
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring  inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5  w-full text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[state=active]:text-foreground py-4 px-4 hover:bg-accent/30 data-[state=active]:bg-accent/80 data-[state=active]:border-b-2 data-[state=active]:border-b-accent group relative cursor-pointer disabled:cursor-default duration-300",
        className,
      )}
      {...props}
    >
      {children}
      <span className="h-1 w-12 group-data-[state=active]:bg-primary absolute bottom-0" />
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
