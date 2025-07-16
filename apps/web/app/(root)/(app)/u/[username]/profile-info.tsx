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
  console.log(comments, isLoading);
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">User Comments</h2>
      <p className="text-gray-600">
        Here you can find all the comments made by the user.
      </p>
      {/* Placeholder for user comments content */}
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
