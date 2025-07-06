import type { CartItem } from "@/types/cart";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("guest_cart") || "[]"),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex(item => item.product._id === action.payload.product._id);
      if (index >= 0) {
        state.items[index].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("guest_cart", JSON.stringify(state.items));
    },
    replaceCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      console.log(state.items)
      localStorage.setItem("guest_cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("guest_cart");
    }
  }
});

export const { addToCart, replaceCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
