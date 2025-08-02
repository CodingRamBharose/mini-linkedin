import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/Post";
import dbConnect from "@/config/dbConnect";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;

    const posts = await Post.find({ author: userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching user posts" },
      { status: 500 }
    );
  }
}
