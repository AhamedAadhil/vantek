// types/Menu.ts

export type Menu = {
  id: number;
  title: string;
  apiUrl?:string,
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
  mainCategory?: string;
  subCategory1?: string;
  subCategory2?: string;
};
