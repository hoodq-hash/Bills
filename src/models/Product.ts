import mongoose, { Schema, Model } from "mongoose";
import type { Product } from "@/types";

const ProductSchema = new Schema<Product>(
  {
    title: { type: String, required: true },
    image: { type: String, required: false },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    design: { type: String, required: true },
    currency: { type: String, required: true },
    mog: { type: String, required: true },
    bills_quantity: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductModel: Model<Product> =
  mongoose.models.Product || mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;
