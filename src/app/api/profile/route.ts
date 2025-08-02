import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import User from "@/models/User";
import dbConnect from "@/config/dbConnect";

export async function GET() {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).select("-password -verifyCode -verifyCodeExpiry");
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { name, bio } = await request.json();

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, bio },
      { new: true }
    ).select("-password -verifyCode -verifyCodeExpiry");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: "Error updating profile" },
      { status: 500 }
    );
  }
}


