'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCartStore } from '@/utils/store';

export default function CustomizationForm({ product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({
    engravingText: '',
    color: '',
  });

  const calculateTotalPrice = () => {
    let price = product.basePrice;
    
    if (customization.engravingText && product.customizationOptions?.engraving?.available) {
      price += product.customizationOptions.engraving.additionalPrice;
    }
    
    if (customization.color) {
      const colorOption = product.customizationOptions?.colorOptions?.find(
        (c) => c.name === customization.color
      );
      if (colorOption) {
        price += colorOption.additionalPrice;
      }
    }
    
    return price * quantity;
  };

  const handleAddToCart = () => {
    if (product.stock < 1) {
      toast.error('Product out of stock');
      return;
    }

    addItem(product, customization, quantity);
    toast.success('Added to cart!');
    router.push('/cart');
  };

  return (
    <div className="space-y-6">
      {product.customizationOptions?.engraving?.available && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engraving Text (Max {product.customizationOptions.engraving.maxCharacters} characters)
            {product.customizationOptions.engraving.additionalPrice > 0 && (
              <span className="text-primary-600 ml-2">
                +₹{product.customizationOptions.engraving.additionalPrice}
              </span>
            )}
          </label>
          <input
            type="text"
            className="input-field"
            maxLength={product.customizationOptions.engraving.maxCharacters}
            value={customization.engravingText}
            onChange={(e) => setCustomization({ ...customization, engravingText: e.target.value })}
            placeholder="Enter your text"
          />
        </div>
      )}

      {product.customizationOptions?.colorOptions?.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Color
          </label>
          <div className="flex gap-3 flex-wrap">
            {product.customizationOptions.colorOptions.map((color) => (
              <button
                key={color.name}
                onClick={() => setCustomization({ ...customization, color: color.name })}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  customization.color === color.name
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <span className="text-sm font-medium">{color.name}</span>
                  {color.additionalPrice > 0 && (
                    <span className="text-xs text-primary-600">+₹{color.additionalPrice}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            -
          </button>
          <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Total Price:</span>
          <span className="text-3xl font-bold text-primary-600">
            ₹{calculateTotalPrice().toLocaleString('en-IN')}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock < 1}
          className="btn-primary w-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
