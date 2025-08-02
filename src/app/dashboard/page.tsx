"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserData } from "@/hooks/useUserData";
import { usePosts } from "@/hooks/usePost";
import { Loader2 } from "lucide-react";
import { PostCard } from "@/components/dashboardComponents/PostCard";
export default function DashboardPage() {
  const { user, isLoading, error } = useUserData();
  const { posts, loading: postsLoading, error: postsError } = usePosts();

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error || postsError) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 sm:gap-6 p-2 sm:p-4 lg:p-6 max-w-6xl mx-auto">
      {/* Left Sidebar */}
      <div className="space-y-4">
        {/* Profile Card */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4">
              <AvatarFallback className="text-lg sm:text-xl lg:text-2xl">
                {user.name?.charAt(0) || 'P'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg sm:text-xl font-bold text-center">{user.name || 'Professional'}</h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mt-1">{user.bio || 'Professional bio'}</p>
            <Button variant="outline" className="mt-3 sm:mt-4 w-full text-sm sm:text-base" asChild>
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </Card>


      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Create Post */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1 justify-start text-gray-500 text-sm sm:text-base h-10 sm:h-11"
                asChild
              >
                <Link href="/post/create">
                  <span className="hidden sm:inline">Share professional updates or insights</span>
                  <span className="sm:hidden">Share an update...</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Your Professional Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0">
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post,index) => (
                <PostCard key={index} post={post} />
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base">No posts yet. Be the first to share!</p>
                <Button asChild className="mt-3 sm:mt-4 text-sm sm:text-base">
                  <Link href="/post/create">Create Post</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </div>

  );
}