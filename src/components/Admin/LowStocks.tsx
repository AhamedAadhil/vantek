import React from "react";
import { ShoppingBag, ShoppingCart, Shirt, Watch } from "lucide-react";
import Image from "next/image";

// Define the icon map first so we can reference its keys in the interface
const iconMap = {
  ShoppingBag: ShoppingBag,
  Shirt: Shirt,
  ShoppingCart: ShoppingCart,
  Watch: Watch,
};

// Now we can use keyof typeof iconMap safely
interface Product {
  variantName: string;
  id: number;
  name: string;
  category: string;
  inStock: boolean;
  availableStocks: number;
  image: string;
}

const LowStocksTable = ({ lowStockInfo }) => {
  return (
    <div className="w-full h-full bg-[#202020] border border-gray-600 text-white text-sm p-4 rounded-lg shadow-lg">
      <div className="mb-4 border-b border-gray-6 pb-2">
        <h2 className="text-lg font-semibold flex items-center">
          <div className="w-1 h-5 bg-blues-500 mr-2"></div>
          Low Stock Products
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm border-b bg-gray-6 border-gray-5">
              <th className="py-3 px-4 font-medium">Product Name</th>
              <th className="py-3 px-4 font-medium">Variant</th>
              <th className="py-3 px-4 font-medium">Stock</th>
              <th className="py-3 px-4 font-medium text-right">
                Available Stocks
              </th>
            </tr>
          </thead>
          <tbody>
            {lowStockInfo?.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-6 hover:bg-gray-6 transition-colors duration-150 ease-in-out"
              >
                <td className="py-4 px-4">{product.name}</td>
                <td className="py-4 px-4">{product.variantName}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-md ${
                      product.inStock
                        ? "text-green-light bg-green-light/30"
                        : "text-reds-300 bg-reds-600/30"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Low_Stock"}
                  </span>
                </td>
                <td className="py-4 px-4 text-right font-medium">
                  {product.availableStocks.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStocksTable;
