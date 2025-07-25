import Link from "next/link";
import { PropsWithChildren } from "react";

export function Sidebar({ children }: PropsWithChildren) {
  // TODO: Change icon as per application fit
  return (
    <aside className="w-[var(--nav-width)] fixed left-0 top-0 bottom-0 border-r border-border bg-background p-2">
      <Link
        href="/"
        className="p-4 text-2xl text-foreground font-semibold block"
      >
        Social Connect
      </Link>
      <div className="flex flex-col gap-2">{children}</div>
    </aside>
  );
}
