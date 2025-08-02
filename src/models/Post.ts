import mongoose, { Schema, Document, Types } from "mongoose";

export interface Post extends Document {
  content: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<Post> = new Schema(
  {
    content: { type: String, required: true, maxlength: 1000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PostModel =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model<Post>("Post", postSchema);

export default PostModel;
