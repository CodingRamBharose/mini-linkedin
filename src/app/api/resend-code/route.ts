import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/config/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
    
    await user.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail({
      email,
      username: user.name,
      otp: verifyCode,
    });

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Verification code sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending verification code:", error);
    return NextResponse.json(
      { success: false, message: "Error resending verification code" },
      { status: 500 }
    );
  }
}
