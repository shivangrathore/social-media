import { AttachmentFile, User } from ".";
import { PollOption } from "./poll";

// TODO: Add more fields to the feed response as needed
export type FeedPost = {
  id: number;
  createdAt: Date;
  userId: number;
  author: User;
  likes: number;
  views: number;
  liked: boolean;
  bookmarked: boolean;
  comments: number;
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
  data: FeedPost[];
  nextCursor: number | null;
};
