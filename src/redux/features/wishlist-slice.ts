import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Variant = {
  _id?: string;
  name: string;
  labelPrice: number;
  actualPrice: number;
  stock: number;
};

type WishListProduct = {
  _id: string;
  productCode: string;
  name: string;
  description: string;
  mainCategory: string;
  subCategory1?: string;
  subCategory2?: string;
  tags?: string[];
  variants: Variant[];
  images: string[];
  topSellingProduct: boolean;
  featuredProduct: boolean;
  isVisible: boolean;
  overAllRating: number;
  reviews: any[]; // If you want you can type this more strongly
   createdAt: Date | string;
  updatedAt: Date | string;
};

type InitialState = {
  items: WishListProduct[];
};

const initialState: InitialState = {
  items: [],
};

export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishListProduct[]>) => {
      state.items = action.payload;
    },
    addItemToWishlist: (state, action: PayloadAction<WishListProduct>) => {
      const newItem = action.payload;
      const exists = state.items.find((item) => item._id === newItem._id);

      if (!exists) {
        state.items.push(newItem);
      }
    },
    removeItemFromWishlist: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item._id !== itemId);
    },
    removeAllItemsFromWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  setWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist,
} = wishlist.actions;
export default wishlist.reducer;
