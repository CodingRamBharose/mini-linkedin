import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Post from "@/models/Post";
import dbConnect from "@/config/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { content, author } = await request.json();

    if (!content || !author) {
      return NextResponse.json(
        { success: false, message: "Content and author are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const newPost = new Post({
      content,
      author,
      likes: [],
      comments: [],
      shares: 0,
    });

    await newPost.save();
    await newPost.populate("author", "name email");

    return NextResponse.json(
      { success: true, message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, message: "Error creating post" },
      { status: 500 }
    );
  }
}
