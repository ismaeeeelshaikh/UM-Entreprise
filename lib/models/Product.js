import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ url: String, public_id: String }],
  stock: { type: Number, default: 0 },
  category: String,
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
