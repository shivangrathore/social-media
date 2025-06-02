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
import Link from "next/link";

export function Sidebar() {
  // TODO: Change icon as per application fit
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
    <aside className="w-[var(--nav-width)] bg-red-500 fixed left-0 top-0 bottom-0">
      <div>
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-2 p-4 text-white hover:bg-red-600"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
