import mongoose, { Schema, Model } from "mongoose";
import type { User } from "@/types";

interface UserDocument extends User {
  password: string;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const UserModel: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
