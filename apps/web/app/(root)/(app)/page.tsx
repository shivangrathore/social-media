import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ComposePost } from "@/features/compose-post/components";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/components/user-profile";
import FeedView from "@/features/feed-view/components";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Home",
};

export default function FeedPage() {
  return (
    <div className="flex gap-36 mb-10">
      <div className="ml-20 space-y-4 max-w-lg shrink-0 w-[600px]">
        <ComposePost />
        <FeedView />
      </div>
      <div className="w-[320px] mt-6 relative shrink-0">
        <div className="sticky top-6">
          <div className="p-4 bg-white rounded-md">
            <Input type="search" placeholder="Search" />
          </div>
          <div className="flex flex-col bg-white p-4 rounded-md mt-4">
            <div className="flex justify-between mt-4">
              <div className="flex gap-2 items-center">
                <Image
                  src="https://randomuser.me/api/portraits/men/31.jpg"
                  alt="Post Image"
                  width={100}
                  height={100}
                  className="rounded-full size-10"
                />
                <div>
                  <h2 className="">Davil Jones</h2>
                  <p className="text-sm text-gray-500">@david</p>
                </div>
              </div>
              <button className="text-red-500 text-sm">Logout</button>
            </div>
            <div>
              <h1 className="text-lg font-medium mt-6">Who to follow</h1>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex gap-2 items-center justify-between">
                  <UserProfile />
                  <Button variant="secondary">Follow</Button>
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <UserProfile />
                  <Button variant="secondary">Follow</Button>
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <UserProfile />
                  <Button variant="secondary">Follow</Button>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-medium mt-6">What's Trending</h1>
              <div className="flex flex-col gap-4 mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
