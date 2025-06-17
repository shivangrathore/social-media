import { FileIcon, HomeIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default function NavigationTopbar() {
  return (
    <div className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-3xl mx-auto flex">
        <Link
          href="/"
          className="flex items-center gap-2 flex-grow hover:bg-blue-100 justify-center p-4"
        >
          <HomeIcon />
          <span className="">Home</span>
        </Link>
        <Link
          href="/friends"
          className="flex items-center gap-2 flex-grow justify-center p-4 hover:bg-blue-100"
        >
          <UsersIcon />
          <span className="">Friends</span>
        </Link>
        <Link
          href="/pages"
          className="flex items-center gap-2 flex-grow justify-center p-4 hover:bg-blue-100"
        >
          <FileIcon />
          <span className="">Pages</span>
        </Link>
      </div>
    </div>
  );
}
