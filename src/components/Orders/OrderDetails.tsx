import { formatToEuro } from "@/helper/formatCurrencyToEuro";
import { formatDateTime } from "@/helper/formatDateTime";
import { getEstimatedDelivery } from "@/helper/getEstimatedDeliveryDate";
import { RootState } from "@/redux/store";
import { Euro, Printer, Share } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const OrderDetails = ({ orderItem }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(orderItem);
  return (
    <>
      <div className="bg-dark text-white p-6 rounded-lg overflow-y-auto max-h-[90vh]">
        <div className="bg-dark text-white p-6 rounded-lg">
          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <h2 className="border-l-4 border-l-blue-600 pl-2 text-lg font-bold">
              Order No -{" "}
              <span className="text-green-light-3">#{orderItem.orderId}</span>
            </h2>
            <div className="text-right">
              <span className="block text-sm bg-purple-300 text-green-900 px-3 py-1 rounded mb-1">
                Estimated delivery: {getEstimatedDelivery(orderItem.createdAt)}
              </span>
              {orderItem.paymentStatus && (
                <span
                  className={`inline-block text-xs font-medium px-3 py-1 rounded 
          ${
            orderItem.paymentStatus === "paid"
              ? "bg-green-500 text-white"
              : orderItem.paymentStatus === "unpaid"
              ? "bg-yellow-400 text-black"
              : "bg-red-500 text-white"
          }`}
                >
                  {orderItem.paymentStatus}
                </span>
              )}
            </div>
          </div>

          {/* ✅ New: Shipping Address block */}
          {orderItem.shippingAddress && (
            <div className="mt-4 bg-gray-800 rounded-md p-4 text-sm">
              <h3 className="text-gray-300 font-semibold mb-2">
                Delivery Address
              </h3>
              <p className="text-gray-400">
                {user?.name}
                <br />
                {orderItem.shippingAddress.houseNumber},{" "}
                {orderItem.shippingAddress.street}
                <br />
                {/* {orderItem.shippingAddress.phone
                ? `, ${orderItem.shippingAddress.phone}`
                : ""}
              <br /> */}
                {orderItem.shippingAddress.city},{" "}
                {orderItem.shippingAddress.zipCode}
                <br />
                {orderItem.shippingAddress.country}
                <br />
                {orderItem.shippingAddress.phone && (
                  <>Phone: {orderItem.shippingAddress.phone}</>
                )}
                <br />
                {user?.email && <>Email: {user?.email}</>}
              </p>
              {orderItem.deliveryNote && (
                <div className="mt-4 bg-gray-800 rounded-md p-4">
                  <h3 className="text-gray-300 font-semibold mb-2">
                    Delivery Note
                  </h3>
                  <p className="text-gray-400 text-sm whitespace-pre-line">
                    {orderItem.deliveryNote}
                  </p>
                </div>
              )}
            </div>
          )}

          <div
            className={`mt-4 overflow-y-auto ${
              orderItem.items.length > 3 ? "max-h-[300px]" : ""
            }`}
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-3">Items</th>
                  <th className="p-3">Tracking No</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItem.items.map((item) => (
                  <tr key={item._id} className="border-b border-gray-700">
                    <td className="p-3 flex items-center space-x-3">
                      <div className="bg-meta-3 rounded-md">
                        <Image
                          src={item.product.images?.[0]} // from item.product
                          alt={item.product.name}
                          width={50}
                          height={50}
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-400">
                          Variant ID: {item.variant}
                        </p>
                        {item.product.topSellingProduct && (
                          <span className="text-xs bg-blue-500 px-2 py-1 rounded text-white">
                            Top Seller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-purple-400">N/A</td>
                    {/* If you don't have tracking */}
                    <td className="p-3 font-bold">{item.price}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 font-bold">
                      {item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t border-gray-6 pt-4">
            <div className="flex justify-between mb-2">
              <span>Total Items:</span>
              <span>{orderItem.items.length}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Sub Total:</span>
              <span>{formatToEuro(orderItem.totalAmount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Applied Coupon:</span>
              <span className="bg-green-500 px-2 py-1 rounded text-white">
                {orderItem.couponCode || "N/A"}
              </span>
            </div>
            <div className="flex justify-between mb-2 items-center">
              <span>Delivery Fees:</span>
              <span
                className={
                  orderItem.totalAmount > 150
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {!orderItem.isUK
                  ? "Shipping charges will be confirmed with you by Vantek."
                  : orderItem.totalAmount > 150
                  ? "Free shipping"
                  : orderItem.shippingMethod === "standard"
                  ? "4.50 EUR"
                  : "8.50 EUR"}
              </span>
            </div>

            {/* ✅ Shipping Method (separate line, only if UK) */}
            {orderItem.isUK && orderItem.shippingMethod && (
              <div className="flex justify-between mb-2 items-center">
                <span>Shipping Method:</span>
                <span
                  className={`px-2 py-1 rounded text-white text-sm font-medium uppercase
        ${
          orderItem.shippingMethod === "standard"
            ? "bg-gray-600"
            : "bg-blue-600"
        }
      `}
                >
                  {orderItem.shippingMethod}
                </span>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold mt-3">
              <span>Total Price:</span>
              <span> {formatToEuro(orderItem.totalAmount)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button className="flex items-center bg-teal-700 hover:bg-teal-900 text-white px-4 py-2 rounded">
              <Printer size={16} className="mr-2" /> Print
            </button>
            <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              <Share size={16} className="mr-2" /> Share Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
