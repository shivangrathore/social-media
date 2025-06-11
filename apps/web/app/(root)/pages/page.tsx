import { Button, buttonVariants } from "@/components/ui/button";
import { ExternalLinkIcon, LinkIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";

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
        <Link
          href="/page/cars-vs-water"
          className={buttonVariants({
            className: "flex-grow",
            variant: "secondary",
          })}
        >
          <ExternalLinkIcon />
          <span>Visit</span>
        </Link>
      </div>
    </div>
  );
}

export default function Pages() {
  return (
    <div className="mx-20 my-4">
      <div className="flex gap-2 items-center">
        <div>
          <h2 className="text-2xl font-medium">Discover Pages</h2>
          <p className="text-gray-600">
            Explore a variety of pages created by users. Find content that
            interests you and connect with like-minded individuals.
          </p>
        </div>
        <div className="ml-auto">
          <Link className={buttonVariants({})} href="/pages/create">
            Create Page
          </Link>
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
