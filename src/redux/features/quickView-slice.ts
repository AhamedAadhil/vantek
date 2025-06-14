import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState = {
  value: {
    _id: "",
    productCode: "",
    name: "",
    description: "",
    mainCategory: "",
    subCategory1: "",
    subCategory2: "",
    tags: [],
    images: [],
    variants: [
      {
        name: "",
        actualPrice: 0,
        labelPrice: 0,
        stock: 0,
      },
    ],
    topSellingProduct: false,
    featuredProduct: false,
    isVisible: true,
    overAllRating: 0,
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Product,
} as InitialState;

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    updateQuickView: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },

    resetQuickView: () => {
      return {
        value: initialState.value,
      };
    },
  },
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;
