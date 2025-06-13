import { Button } from "@/components/ui/button";

export default function FriendsPage() {
  return (
    <div className="max-w-4xl mx-auto my-4">
      <div className="bg-white rounded-md">
        <h1 className="text-2xl font-bold mb-4">People you may know</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Example friend cards */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border-border border p-4 rounded-md shadow"
            >
              {/* Add Image */}
              <img
                src={`https://randomuser.me/api/portraits/men/${index + 1}.jpg`}
                alt={`User ${index + 1}`}
                className="w-full aspect-square object-cover rounded-md mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button className="">Add Friend</Button>
                <Button className="" variant="secondary">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
