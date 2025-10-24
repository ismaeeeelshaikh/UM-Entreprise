import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      image: String,
      quantity: Number,
      price: Number,
    }
  ],
  amount: Number,
  address: String,
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"]
  },
  cancelReason: String,
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
