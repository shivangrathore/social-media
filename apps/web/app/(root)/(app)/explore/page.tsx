import { getTrendingTags } from "@/features/explore/api";
import { pluralize } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Explore",
};

function WhoToFollow() {
  const users = [
    { username: "user1", name: "User One" },
    { username: "user2", name: "User Two" },
    { username: "user3", name: "User Three" },
    { username: "user4", name: "User Four" },
  ];
  return (
    <div className="p-4 mt-4 rounded-md w-full">
      <h3 className="text-lg font-semibold">Who to follow</h3>
      <ul className="mt-4 space-y-2">
        {users.map((user, index) => (
          <li key={index} className="flex items-center space-x-2">
            <img
              src={`https://i.pravatar.cc/150?u=${user.username}`}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <Link href={`/profile/${user.username}`}>
                <h4 className="font-semibold">{user.name}</h4>
                <p className="text-sm text-gray-600">@{user.username}</p>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Trending() {
  const tags = await getTrendingTags();
  return (
    <div className="p-4 mt-4 rounded-md w-full">
      <h3 className="text-lg font-semibold">Trending</h3>
      <p className="text-sm text-gray-500">Explore what's tending in India</p>
      <div>
        <ul className="mt-4 space-y-2 grid">
          {tags.map((item, index) => (
            <Link
              href={`/search?query=${encodeURIComponent(`#${item.tag}`)}`}
              key={index}
            >
              <li key={index} className="rounded-md">
                <h4 className="font-semibold text-sm">#{item.tag}</h4>
                <p className="text-sm text-gray-600">
                  {pluralize(item.postCount, "post")}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="w-2xl my-4">
      <Trending />
      <hr />
      <WhoToFollow />
    </div>
  );
}
