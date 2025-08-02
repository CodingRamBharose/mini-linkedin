"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
          author: user._id,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      router.push("/"); // Redirect to home page after successful post creation
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div className="flex justify-center p-4 sm:p-8 text-sm sm:text-base">Loading user data...</div>;

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4 lg:p-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Create New Post</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm sm:text-base">What&apos;s on your mind?</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your professional thoughts..."
                required
                rows={4}
                className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-none"
                maxLength={1000}
              />
              <div className="text-xs sm:text-sm text-gray-500 text-right">
                {content.length}/1000
              </div>
            </div>

            <Button type="submit" disabled={isLoading || !content.trim()} className="w-full h-10 sm:h-11 text-sm sm:text-base">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Share Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
