import { createSlice } from "@reduxjs/toolkit";
import { actGetWishlist } from "./act/actGetWichlist";

export interface IWishlist {
  productId: string[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  loadingProductIds: string[]; // Track which products are loading
  error: string | null;
  totalWishListQuantity: number;
}

const initialState: IWishlist = {
  productId: [],
  totalWishListQuantity: 0,
  loading: "idle",
  loadingProductIds: [],
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initialState,
  reducers: {
    productsCleanUp: (state) => {
      state.productId = [];
      state.totalWishListQuantity = 0; // ✅ ADD THIS - Reset count when cleaning up
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetWishlist.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
        // Add the product ID to loading array
        const productId = action.meta.arg.productId;
        if (!state.loadingProductIds.includes(productId)) {
          state.loadingProductIds.push(productId);
        }
      })
      .addCase(actGetWishlist.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const { type, id } = action.payload;

        if (type === "add") {
          state.productId.push(id);
          state.totalWishListQuantity += 1; // ✅ ADD THIS
        } else if (type === "remove") {
          state.productId = state.productId.filter(
            (productId) => productId !== id
          );
          state.totalWishListQuantity -= 1; // ✅ ADD THIS
        }

        // Remove the product ID from loading array
        state.loadingProductIds = state.loadingProductIds.filter(
          (productId) => productId !== id
        );
      })
      .addCase(actGetWishlist.rejected, (state, action) => {
        state.loading = "failed";
        if (action.payload && typeof action.payload === "string") {
          state.error = action.payload;
        }

        // Remove the product ID from loading array
        const productId = action.meta.arg.productId;
        state.loadingProductIds = state.loadingProductIds.filter(
          (id) => id !== productId
        );
      });
  },
});

export default wishlistSlice.reducer;
export { actGetWishlist };
export const { productsCleanUp } = wishlistSlice.actions;
