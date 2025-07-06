import mongoose, { Schema, Model } from "mongoose";
import { IAuthor } from "../types/author";


const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    bio: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const author : Model<IAuthor> = mongoose.model<IAuthor>("Author", AuthorSchema);
export default author;