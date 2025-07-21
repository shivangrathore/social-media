import { PostType } from "./request";

export interface User {
  id: number;
  username: string;
  createdAt: Date;
  avatar: string | null;
  name: string | null;
  bio: string | null;
  isFollowing?: boolean; // Indicates if the current user is following this user
  isProfilePublic?: boolean; // Indicates if the profile is public, then we further fetch the profile details like posts/comments
}
export interface Attachment {
  id: number;
  url: string;
  assetId: string;
  publicId: string;
  type: "image" | "video";
  userId: number;
  postId: number;
  createdAt: Date;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  parentId: number | null;
  content: string;
  createdAt: Date;
}

interface BasePost {
  id: number;
  userId: number;
  type: PostType;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  publishedAt: Date | null;
}

export interface DraftPost extends BasePost {}
export interface Post extends BasePost {
  attachments: Attachment[];
}

export interface PollMeta {
  id: number;
  options: string[];
  expiresAt: Date | null;
}

interface PollOption {
  id: number;
  text: string;
  voteCount: number;
}

export type FeedPost = {
  id: number;
  userId: number;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  publishedAt: Date | null;
  bookmarkedByMe: boolean;
  likedByMe: boolean;
  author: User;
} & (
  | {
      postType: "regular";
      attachments: Attachment[];
    }
  | {
      postType: "poll";
      options: PollOption[];
      selectedOption: number | null;
      expiresAt: Date | null;
    }
);

export interface Like {
  id: number;
  userId: number;
  targetId: number;
  createdAt: Date;
  targetType: "post" | "comment";
}

export interface Hashtag {
  id: number;
  name: string;
  postCount: number;
  createdAt: Date;
}

export interface TrendingTag {
  tag: string;
  postCount: number;
}

export interface Chat {
  id: number;
  users: User[];
  createdAt: Date;
}

export type ChatType = "group" | "private";

export interface ChatMessage {
  id: number;
  chatId: number;
  userId: number;
  content: string;
  createdAt: Date;
  isRequest: boolean;
  user: User;
}
