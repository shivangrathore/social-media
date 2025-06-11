import { Sidebar } from "@/components/sidebar";

import { CompassIcon, HomeIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function PagesLayout({ children }: PropsWithChildren) {
  const sidebarItems = [
    { name: "Feed", href: "/", icon: HomeIcon },
    { name: "Discover", href: "/pages/", icon: CompassIcon },
    { name: "Liked Pages", href: "/pages/liked", icon: ThumbsUpIcon },
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
      <div className="ml-auto w-[calc(100%-var(--nav-width))]">{children}</div>
    </div>
  );
}
