import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, customization = {}, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) => 
            item.product._id === product._id &&
            JSON.stringify(item.customization) === JSON.stringify(customization)
        );

        if (existingIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...items,
              {
                product,
                customization,
                quantity,
                price: calculatePrice(product, customization),
              },
            ],
          });
        }
      },

      removeItem: (index) => {
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        }));
      },

      updateQuantity: (index, quantity) => {
        if (quantity < 1) return;
        set((state) => {
          const updatedItems = [...state.items];
          updatedItems[index].quantity = quantity;
          return { items: updatedItems };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'um-cart-storage',
    }
  )
);

function calculatePrice(product, customization) {
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

  return price;
}
