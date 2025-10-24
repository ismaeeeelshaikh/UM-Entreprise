import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['wallet', 'pen', 'keychain', 'ring', 'bangle', 'other'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: 0,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    customizationOptions: {
      engraving: {
        available: { type: Boolean, default: false },
        maxCharacters: { type: Number, default: 20 },
        additionalPrice: { type: Number, default: 0 },
      },
      photoUpload: {
        available: { type: Boolean, default: false },
        additionalPrice: { type: Number, default: 0 },
      },
      colorOptions: [
        {
          name: String,
          hexCode: String,
          additionalPrice: { type: Number, default: 0 },
        },
      ],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, featured: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
