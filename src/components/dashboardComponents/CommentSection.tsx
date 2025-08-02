"use client";
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user: currentUser } = useUserData();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        const error = await response.json();
        console.error("Failed to fetch comments:", error);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    if (!currentUser) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prevComments => [comment, ...prevComments]);
        setNewComment("");
        toast.success("Comment added successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4">
      <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Comments</h3>

      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-3 sm:mb-4">
        <div className="flex gap-2">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
            <AvatarFallback className="text-xs sm:text-sm">
              {currentUser?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[50px] sm:min-h-[60px] mb-2 text-sm sm:text-base resize-none"
              maxLength={1000}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !newComment.trim()}
                className="text-xs sm:text-sm px-3 sm:px-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Posting...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Post Comment</span>
                    <span className="sm:hidden">Post</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-3 sm:py-4">
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {comments.map((comment, index) => (
            <div key={comment._id || `comment-${index}`} className="flex gap-2">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                <AvatarFallback className="text-xs sm:text-sm">
                  {comment.author?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-lg">
                  <div className="font-medium text-xs sm:text-sm">{comment.author?.name || 'Unknown User'}</div>
                  <p className="text-xs sm:text-sm mt-1 break-words">{comment.content}</p>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-3 sm:py-4 text-xs sm:text-sm">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}
