import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Remove duplicate index warning if already defined elsewhere
  },
  password: String,
  avatar: {
    url: String,
    public_id: String
  },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
