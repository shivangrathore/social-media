import { getTrendingTags } from "@/features/explore/api";
import { pluralize } from "@/lib/utils";
import Link from "next/link";
import { WhoToFollow } from "./who-to-follow";

export const metadata = {
  title: "Explore",
};

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
