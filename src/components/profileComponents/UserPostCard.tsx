"use client";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { formatDistanceToNow } from "date-fns";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots, FaRegShareFromSquare } from "react-icons/fa6";
import { Trash2, Loader2 } from "lucide-react";
import { CommentSection } from "../dashboardComponents/CommentSection";
import { toast } from "sonner";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function UserPostCard({ post, onDelete }: { post: { _id: string; content: string; author: { name: string }; likes?: string[]; comments?: unknown[]; images?: string[]; createdAt: string }; onDelete: (postId: string) => Promise<boolean> }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    setIsLikeLoading(true);
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to like post");
      
      const data = await response.json();
      setIsLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      const success = await onDelete(post._id);
      if (success) {
        toast.success("Post deleted successfully");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleteLoading(false);
    }
  };

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
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this post? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="w-full">
          <p className="text-sm sm:text-base leading-relaxed">{post.content}</p>
          {/* Display images if they exist */}
          {(post.images?.length || 0) > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {post.images?.map((image: string) => (
                <div key={image} className="relative aspect-square">
                  <Image
                    src={image}
                    alt="Post image"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          )}



          {/* Post actions */}
          <div className="flex mt-4 border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLikeLoading}
            >
              <div className="flex items-center">
                {isLikeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isLiked ? (
                  <AiFillLike className="h-4 w-4 text-blue-500" />
                ) : (
                  <AiOutlineLike className="h-4 w-4" />
                )}
                <span className="ml-2">{likesCount}</span>
                <span className="ml-1">Like</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleComments}
            >
              <div className="flex items-center">
                <FaRegCommentDots className="h-4 w-4" />
                <span className="ml-2 ">{post.comments?.length || 0}</span>
                <span className="ml-1">Comment</span>
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
