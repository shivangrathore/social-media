import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, ThumbsUpIcon } from "lucide-react";

export const metadata = {
  title: "Pages",
};

function PageComponent({
  imageUrl,
  title,
  category,
}: {
  imageUrl: string;
  title: string;
  category: string;
}) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-52 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-500">{category}</p>
      <div className="mt-2 flex gap-2">
        <Button variant="secondary" className="flex-grow">
          <ThumbsUpIcon />
          <span>Like</span>
        </Button>
        <Button variant="secondary" className="flex-grow">
          <ExternalLinkIcon />
          <span>Visit</span>
        </Button>
      </div>
    </div>
  );
}

export default function Pages() {
  return (
    <div className="mx-20 my-4">
      <div className="flex gap-2 items-center">
        <div>
          <h2 className="text-2xl font-medium">Pages you like or follow</h2>
        </div>
      </div>
      <div className="grid mt-6 gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
        {new Array(12).fill(null).map((_, index) => (
          <PageComponent
            key={index}
            imageUrl="https://placehold.co/600x500.png"
            title="Cars vs Water"
            category="Cars"
          />
        ))}
      </div>
    </div>
  );
}
