import { ComposePost } from "@/features/post-compose/components";
import FeedView from "@/features/feed-view/components";
import { SuggestionPanel } from "@/components/suggestion-panel";

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
      <SuggestionPanel />
    </div>
  );
}
