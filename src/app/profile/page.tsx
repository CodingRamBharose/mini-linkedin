"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit2, Loader2 } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";
import { useUserData } from "@/hooks/useUserData";
import { useUserPosts } from "@/hooks/useUserPosts";
import { UserPostCard } from "@/components/profileComponents/UserPostCard";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoading, error, refreshUserData } = useUserData();
  const { posts, loading: postsLoading, error: postsError, deletePost } = useUserPosts(user?._id);



  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="relative p-0">
          <div className="h-32 sm:h-40 md:h-48 bg-blue-100 rounded-t-lg"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 px-4 sm:px-6 pb-4 sm:pb-6 mt-[-2rem] sm:mt-[-3rem]">
            <div className="relative">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-white">
                <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl bg-blue-100">
                  {user.name?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
              <div className="space-y-1 sm:space-y-2">
                <CardTitle className="text-xl sm:text-2xl">{user.name}</CardTitle>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {isEditing ? (
            <ProfileForm
              user={user}
              onSuccess={async () => {
                await refreshUserData();
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg">About</h3>
                <p className="text-gray-600 mt-2">
                  {user.bio || "No bio added yet."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {postsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : postsError ? (
            <div className="text-center py-8 text-red-500">
              Error loading posts: {postsError}
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <UserPostCard key={post._id || post.id} post={post as any} onDelete={deletePost} />
            ))
          ) : (
            <div className="text-center py-8">
              <p>You haven&apos;t created any posts yet.</p>
              <Button asChild className="mt-4">
                <a href="/post/create">Create Post</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}