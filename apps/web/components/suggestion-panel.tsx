"use client";
import { useUser } from "@/store/auth";
import { Input } from "./ui/input";
import { UserProfile } from "./user-profile";
import { Button } from "./ui/button";
import Link from "next/link";

export function SuggestionPanel() {
  const { user, isLoading } = useUser();
  return (
    <div className="w-[320px] mt-6 relative shrink-0">
      <div className="sticky top-6">
        <Input type="search" placeholder="Search" className="py-5" />
        <div className="flex flex-col p-4 rounded-md mt-4 bg-background border border-border">
          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center">
              {user ? <UserProfile {...user} /> : <></>}
            </div>
            <Link
              prefetch={false}
              href={"/api/v1/auth/logout"}
              className="text-red-500 text-sm"
            >
              Logout
            </Link>
          </div>
          <div>
            <h1 className="text-lg font-medium mt-6">Who to follow</h1>
            <div className="flex flex-col gap-4 mt-4">
              {new Array(3).fill(0).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center justify-between"
                >
                  <UserProfile username={`User${index + 1}`} />
                  <Button variant="secondary">Follow</Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-lg font-medium mt-6">What's Trending</h1>
            <div className="flex flex-col gap-4 mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
