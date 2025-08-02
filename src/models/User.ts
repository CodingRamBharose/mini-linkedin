import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;

  // Email verification fields
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  emailVerified?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
    password: { type: String, required: true },
    bio: { type: String, maxlength: 300 },

    isVerified: { type: Boolean, default: false },
    verifyCode: { type: String, required: true },
    verifyCodeExpiry: { type: Date, required: true },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
