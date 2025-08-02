"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa6";
import { useUserData } from "@/hooks/useUserData";
import { CommentSection } from "./CommentSection";
import { toast } from "sonner";
import { PostData } from "@/types/post";

export function PostCard({ post }: { post: PostData }) {
  const { user: currentUser } = useUserData();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Check if current user has liked the post
  useEffect(() => {
    if (currentUser?._id && post.likes) {
      const userLiked = post.likes.some((likeId: string) => likeId === currentUser._id);
      setIsLiked(userLiked);
    }
  }, [currentUser, post.likes]);



  const handleLike = async () => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to like posts");
        return;
      }

      setIsLikeLoading(true);

      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      } else {
        toast.error(data.error || "Failed to like post");
      }
    } catch (err) {
      console.error("Like action failed:", err);
      toast.error("Failed to like post");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Don't show post if author doesn't exist
  const authorExists = !!post.author;

  if (!authorExists) {
    return null; // Don't render the post if author doesn't exist
  }

  return (
    <div className="border-2 border-white p-3 sm:p-4 rounded-md shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-start gap-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarFallback className="text-sm sm:text-base">
                {post.author?.name?.charAt(0) || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col ml-2 sm:ml-3">
              <p className="font-medium text-sm sm:text-base">{post.author?.name || "Professional"}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>


        </div>

        <div className="w-full">
          <p className="text-sm sm:text-base leading-relaxed">{post.content}</p>

          <div className="flex gap-2 sm:gap-4 mt-3 border-t pt-3 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLikeLoading}
              className={`${isLiked ? "text-green-600" : ""} text-xs sm:text-sm px-2 sm:px-3`}
            >
              <div className="flex items-center">
                {isLiked ? (
                  <AiFillLike className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <AiOutlineLike className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="ml-1 sm:ml-2">{likesCount}</span>
                <span className="ml-1 hidden sm:inline">Like</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleComments}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <div className="flex items-center">
                <FaRegCommentDots className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1 sm:ml-2">{post.comments?.length || 0}</span>
                <span className="ml-1 hidden sm:inline">Comment</span>
              </div>
            </Button>
          </div>

          {showComments && (
            <CommentSection postId={post._id} />
          )}
        </div>
      </div>
    </div>
  );
}