import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Post from "@/models/Post";
import User from "@/models/User";
import dbConnect from "@/config/dbConnect";

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

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id) => !id.equals(user._id));
    } else {
      // Like the post
      post.likes.push(user._id);
    }

    await post.save();

    return NextResponse.json(
      { 
        success: true, 
        liked: !isLiked,
        likesCount: post.likes.length 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json(
      { success: false, message: "Error liking post" },
      { status: 500 }
    );
  }
}
