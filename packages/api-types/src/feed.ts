import { AttachmentFile, User } from ".";
import { PollOption } from "./poll";

// TODO: Add more fields to the feed response as needed
export type FeedEntry = {
  id: number;
  createdAt: Date;
  userId: number;
  author: User;
  views: number;
} & (
  | {
      postType: "poll";
      question: string;
      options: PollOption[];
      selectedOption: number | null;
    }
  | {
      postType: "regular";
      content: string | null;
      attachments: AttachmentFile[];
    }
);

export type FeedResponse = {
  data: FeedEntry[];
  nextCursor: number | null;
};
