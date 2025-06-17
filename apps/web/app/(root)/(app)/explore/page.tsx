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
    <div className="p-4 mt-4 bg-white rounded-md w-full">
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

function Trending() {
  const trendingTags = [
    { tag: "#India", count: 1200 },
    { tag: "#Technology", count: 800 },
    { tag: "#Health", count: 600 },
    { tag: "#Finance", count: 500 },
  ];
  return (
    <div className="p-4 mt-4 bg-white rounded-md w-full">
      <h3 className="text-lg font-semibold">Trending</h3>
      <p className="text-sm text-gray-500">Explore what's tending in India</p>
      <div>
        <ul className="mt-4 space-y-2 grid">
          {trendingTags.map((item, index) => (
            <Link href={`/trending/${item.tag}`} key={index}>
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <h4 className="font-semibold">{item.tag}</h4>
                <p className="text-sm text-gray-600">
                  {item.count.toLocaleString()} mentions
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
function SuggestedCommunities() {
  const communities = [
    { name: "Tech Enthusiasts", description: "Discuss the latest in tech" },
    { name: "Health & Wellness", description: "Share health tips and advice" },
    { name: "Travel Lovers", description: "Explore travel stories and tips" },
    {
      name: "Foodies",
      description: "Share your favorite recipes and restaurants",
    },
  ];
  return (
    <div className="p-4 mt-4 bg-white rounded-md w-full">
      <h3 className="text-lg font-semibold">Suggested Communities</h3>
      <ul className="mt-4 space-y-2">
        {communities.map((community, index) => (
          <li
            key={index}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <h4 className="font-semibold">{community.name}</h4>
            <p className="text-sm text-gray-600">{community.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="w-2xl my-4">
      <Trending />
      <WhoToFollow />
      <SuggestedCommunities />
    </div>
  );
}
