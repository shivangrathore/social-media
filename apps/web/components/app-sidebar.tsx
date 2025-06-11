import Link from "next/link";
import { Sidebar } from "./sidebar";
import {
  BookmarkIcon,
  CircleEllipsisIcon,
  CompassIcon,
  FileIcon,
  HomeIcon,
  MessageSquareIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

export default function AppSidebar() {
  const sidebarItems = [
    { name: "Feed", href: "/", icon: HomeIcon },
    { name: "Pages", href: "/pages", icon: FileIcon },
    { name: "Explore", href: "/explore", icon: CompassIcon },
    { name: "Friends", href: "/friends", icon: UsersIcon },
    { name: "Messages", href: "/messages", icon: MessageSquareIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Saved", href: "/saved", icon: BookmarkIcon },
    { name: "More", href: "#", icon: CircleEllipsisIcon, type: "button" },
  ];

  return (
    <Sidebar>
      {sidebarItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center gap-2 p-4 text-foreground hover:bg-gray-100"
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </Sidebar>
  );
}
