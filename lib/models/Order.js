import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  paymentId: String,
  orderId: String,
  user: String, // Or mongoose.Schema.Types.ObjectId, if you use refs
  status: { type: String, default: 'pending' },
  items: [{
    productId: String,
    name: String,
    image: String,
    quantity: Number,
    price: Number,
    customization: Object
  }],
  address: String,
  amount: Number,
  cancelReason: String, // <-- ADDED FOR CANCELLATION REASON
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// 🛑 FINAL FIX: Use Node.js module export for compatibility with the new db.js require() structure
module.exports = Order; 
