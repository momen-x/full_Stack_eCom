import domin from "@/app/utils/Domin";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const actGetWishlist = createAsyncThunk(
  "wishlist/actGetWishlist",
  async (
    {
      userId,
      productId,
      wishlist,
    }: {
      userId: string;
      productId: string;
      wishlist: string[];
    },
    thunkAPI
  ) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await axios.patch<{
        success: boolean;
        type: "add" | "remove";
        productId: string;
        wishlist: string[];
      }>(`${domin}/api/users`, {
        userId: userId,
        productId: productId,
        process: "addOrRemoveItemFromWichlist",
        wishlist: wishlist,
      });

      return {
        type: response.data.type,
        id: response.data.productId,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);
