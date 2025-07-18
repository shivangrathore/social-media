"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/features/feed-view/components/post-card";
import { PostSkeleton } from "@/features/feed-view/components/post-skeleton";
import { useUserComments } from "@/features/user/hooks/use-user-comments";
import { useUserPosts } from "@/features/user/hooks/use-user-posts";

function UserPosts({ id }: { id: number }) {
  const { posts, isLoading } = useUserPosts(id);
  return (
    <div className="p-4">
      {isLoading &&
        new Array(5).fill(0).map((_, index) => <PostSkeleton key={index} />)}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} query={`user:posts:${id}`} />
      ))}
    </div>
  );
}

function UserComments({ id }: { id: number }) {
  const { comments, isLoading } = useUserComments(id);
  return (
    <div className="flex gap-2 flex-col">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b p-4">
          <p className="text-sm text-foreground">{comment.content}</p>
          <span className="text-xs text-muted-foreground">
            Posted on {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProfileInfo({ id }: { id: number }) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="posts" className="">
          Posts
        </TabsTrigger>
        <TabsTrigger value="comments" className="">
          Comments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <UserPosts id={id} />
      </TabsContent>
      <TabsContent value="comments">
        <UserComments id={id} />
      </TabsContent>
    </Tabs>
  );
}
