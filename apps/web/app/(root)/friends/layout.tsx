import NavigationTopbar from "@/components/navigation-topbar";
import { Sidebar } from "@/components/sidebar";

import { HomeIcon, UserIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function FriendsLayout({ children }: PropsWithChildren) {
  const sidebarItems = [
    { name: "Home", href: "/friends", icon: HomeIcon },
    { name: "Friend requests", href: "/friends/requests", icon: UserIcon },
    { name: "Suggestions", href: "/friends/suggestions", icon: UserPlusIcon },
    { name: "All Friends", href: "/friends/all", icon: UsersIcon },
  ];
  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <div>
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
        </div>
      </Sidebar>
      <div className="ml-auto w-[calc(100%-var(--nav-width))]">
        <NavigationTopbar />
        {children}
      </div>
    </div>
  );
}
