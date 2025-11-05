import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IProduct {
  id: string;
  quantity: number;
  title: string;
  price: number;
  img: string;
  category: string;
}

export interface ICartState {
  items: IProduct[];
  totalPrice: number;
  totalQuantity: number;
}

const initialState: ICartState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
};

// Helper function to calculate totals
const calculateTotals = (items: IProduct[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return { totalQuantity, totalPrice };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart or increase quantity if already exists
    addToCart: (state, action: PayloadAction<Omit<IProduct, "quantity">>) => {
      //check if the item exist in cart add quantity this product else add one item
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // Item exists, increase quantity
        existingItem.quantity += 1;
      } else {
        // New item, add to cart with quantity 1
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }

      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;
    },

    // Remove item completely from cart
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Recalculate totals
      const totals = calculateTotals(state.items);
      state.totalPrice = totals.totalPrice;
      state.totalQuantity = totals.totalQuantity;
    },

    // Clear entire cart
    clearCart: (state) => {
      // return cart items to inital values
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
    // Increase item quantity by 1
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;

        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalPrice = totals.totalPrice;
        state.totalQuantity = totals.totalQuantity;
      }
    },

    // Decrease item quantity by 1
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity === 1) {
          // Remove item if quantity would become 0
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        } else {
          item.quantity -= 1;
        }

        // Recalculate totals
        const totals = calculateTotals(state.items);
        state.totalPrice = totals.totalPrice;
        state.totalQuantity = totals.totalQuantity;
      }
    },
  },
});

export const {
  addToCart,
  deleteItem,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
