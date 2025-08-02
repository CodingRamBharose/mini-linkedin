import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/config/dbConnect';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { email, code } = body;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'User is already verified' },
        { status: 400 }
      );
    }

    if (!user.verifyCode || user.verifyCode !== code) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    if (!user.verifyCodeExpiry || user.verifyCodeExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Verification code has expired' },
        { status: 400 }
      );
    }

    user.isVerified = true;

    try {
      await user.save();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Database error while updating user' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during verification:', error);
    return NextResponse.json(
      { success: false, message: 'Email verification failed' },
      { status: 500 }
    );
  }
}
