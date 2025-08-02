import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/config/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { name, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        // Update existing unverified user
        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        existingUser.name = name;
        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
        
        await existingUser.save();
        
        // Send verification email
        const emailResponse = await sendVerificationEmail({
          email,
          username: name,
          otp: verifyCode,
        });
        if (!emailResponse.success) {
          return NextResponse.json(
            { success: false, message: "Failed to send verification email" },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { success: true, message: "User updated. Please verify your email." },
          { status: 200 }
        );
      }
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      isVerified: false,
    });

    await newUser.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail({
      email,
      username: name,
      otp: verifyCode,
    });
    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User registered successfully. Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
