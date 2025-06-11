import Image from "next/image";

export function UserProfile() {
  return (
    <div className="flex gap-2 items-center">
      <Image
        src="https://randomuser.me/api/portraits/men/31.jpg"
        alt="Post Image"
        width={100}
        height={100}
        className="rounded-full size-10"
      />
      <div>
        <h2 className="text-sm font-medium">Davil Jones</h2>
        <p className="text-xs text-gray-500">@david</p>
      </div>
    </div>
  );
}
