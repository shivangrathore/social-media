"use client";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import {
  BookmarkIcon,
  CircleEllipsisIcon,
  CompassIcon,
  HomeIcon,
  MessageSquareIcon,
  UserIcon,
  BellIcon,
} from "lucide-react";
import { useUser } from "@/store/auth";

export default function AppSidebar() {
  const { user } = useUser();
  const sidebarItems = [
    { name: "Feed", href: "/", icon: HomeIcon },
    { name: "Explore", href: "/explore", icon: CompassIcon },
    { name: "Messages", href: "/messages", icon: MessageSquareIcon },
    { name: "Saved", href: "/saved", icon: BookmarkIcon },
    { name: "Notifications", href: "/notifications", icon: BellIcon },
    { name: "Profile", href: `/u/${user?.username}`, icon: UserIcon },
    { name: "More", href: "#", icon: CircleEllipsisIcon, type: "button" },
  ];

  return (
    <Sidebar>
      {sidebarItems.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-2 p-4 py-3 text-foreground bg-background hover:bg-neutral-700 rounded-md"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </Sidebar>
  );
}
