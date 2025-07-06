import mongoose, { Schema, Model } from "mongoose";
import { ICategory } from "../types/category";
import slugify from "slugify";


const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

CategorySchema.pre<ICategory>("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const category : Model<ICategory> = mongoose.model<ICategory>("Category", CategorySchema);
export default category