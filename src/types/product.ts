// export type Product = {
//   title: string;
//   description: string;
//   reviews: number;
//   price: number;
//   discountedPrice: number;
//   id: number;
//   imges?: {
//     thumbnails: string[];
//     previews: string[];
//   };
// };
export type Product = {
    productCode: string;
    name: string;
    description: string;
    mainCategory: string;
    subCategory1: string;
    subCategory2: string;
    tags: string[];
    images: string[];
    variants: [{
      name:string,
      actualPrice:number,
      labelPrice:number,
      stock:number
    }];
    topSellingProduct: boolean;
    featuredProduct: boolean;
    isVisible: boolean;
    overAllRating: number;
    reviews: [];
    createdAt: Date;
    updatedAt: Date;
};