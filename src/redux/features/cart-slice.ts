import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
};

type CartItem = {
  _id: string;
  name: string;
  actualPrice: number;
  quantity: number;
  variantId: string;
  images?: string;
};

const initialState: InitialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const {
        _id,
        name: title,
        actualPrice,
        quantity,
        images,
        variantId,
      } = action.payload;
      const existingItem = state.items.find(
        (item) => item._id === _id && item.variantId === variantId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id,
          name: title,
          actualPrice,
          quantity,
          images,
          variantId,
        });
      }
    },
    removeItemFromCart: (
      state,
      action: PayloadAction<{
        _id: number | string;
        variantId: number | string;
      }>
    ) => {
      const { _id, variantId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item._id === _id && item.variantId === variantId)
      );
    },
    updateCartItemQuantity: (
  state,
  action: PayloadAction<{ id: number; variantId: number; quantity: number }>
) => {
  const { id, variantId, quantity } = action.payload;
  const existingItem = state.items.find(
    (item) => item._id === id && item.variantId === variantId
  );

  if (existingItem) {
    existingItem.quantity = quantity;
  }
},

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },

    setCart: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        totalPrice: number;
        totalItems: number;
      }>
    ) => {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
      state.totalItems = action.payload.totalItems;
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.actualPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  setCart,
} = cart.actions;
export default cart.reducer;
