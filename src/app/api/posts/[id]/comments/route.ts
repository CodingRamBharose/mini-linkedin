import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import dbConnect from "@/config/dbConnect";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const comments = await Comment.find({ post: id })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const { id } = await params;

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if post exists
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const newComment = new Comment({
      content,
      author: user._id,
      post: id,
    });

    await newComment.save();
    await newComment.populate("author", "name email");

    // Add comment to post's comments array
    post.comments.push(newComment._id);
    await post.save();

    return NextResponse.json(
      { success: true, message: "Comment created successfully", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, message: "Error creating comment" },
      { status: 500 }
    );
  }
}
