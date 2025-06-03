"use client";

import { formatToEuro } from "@/helper/formatCurrencyToEuro";
import { formatDateTime } from "@/helper/formatDateTime";
import { getEstimatedDelivery } from "@/helper/getEstimatedDeliveryDate";
import { Printer, Share, BadgeCheck, Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const AdminOrderDetails = () => {
  const [order, setOrder] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "");
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("selectedOrder");
    console.log("b4rrr updat session", JSON.parse(storedOrder));
    try {
      if (storedOrder && storedOrder !== "undefined") {
        const parsed = JSON.parse(storedOrder);
        setOrder(parsed);
      }
    } catch (err) {
      console.error("Invalid JSON in sessionStorage", err);
      sessionStorage.removeItem("selectedOrder"); // Clean up corrupted data
    }
  }, []);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (!order || !order.items) return <p>Loading...</p>;

  const calculateSubtotal = () => {
    return order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  const handleStatusUpdate = async (
    status: string,
    trackingIdInput?: string,
    trackingUrlInput?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          status,
          ...(status === "shipped" && trackingIdInput && trackingUrlInput
            ? {
                trackingId: trackingIdInput,
                trackingUrl: trackingUrlInput,
              }
            : {}),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update order status");
      }
      // TODO:toast
      const updatedOrder = await res.json();
      console.log("data from backend after success", updatedOrder);
      sessionStorage.removeItem("selectedOrder");
      setOrder(updatedOrder.data); // Update UI
      if (updatedOrder?.data) {
        sessionStorage.setItem(
          "selectedOrder",
          JSON.stringify(updatedOrder.data)
        );
        console.log("data from backend after success", updatedOrder);
        console.log(
          "after updat session",
          JSON.parse(sessionStorage.getItem("selectedOrder"))
        );
      }
      alert("Order updated successfully");
      // window.location.reload();
    } catch (error) {
      console.error(error);
      alert(
        error.message || "An error occurred while updating the order status"
      );
    }
  };

  return (
    <div className="grid grid-cols-6 grid-rows-5 gap-2">
      {/* Order Items and Summary */}
      <div className="col-span-4 row-span-5 p-4">
        <div className="bg-dark text-white p-6 rounded-lg">
          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <div className=" flex flex-col sm:flex-row items-start sm:items-center">
              <h2 className="border-l-4 border-l-blue-600 pl-2 text-lg font-bold">
                Order No -{" "}
                <span className="text-green-light-3">#{order.orderId}</span>
                <span
                  className={`inline-block px-2 py-1 ml-2 text-xs font-semibold rounded
    ${order.isUK ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {order.isUK ? "UK" : "NON-UK"}
                </span>
              </h2>
            </div>
            Estimated delivery: {getEstimatedDelivery(order.createdAt)}
          </div>

          <table className="w-full mt-4 border-collapse text-left">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="p-3">Items</th>
                <th className="p-3">Price</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any) => {
                // Find matching variant object by comparing variant ID
                const variantObj = item.product?.variants?.find(
                  (v: any) => v._id === item.variant
                );

                return (
                  <tr key={item._id} className="border-b border-gray-700">
                    <td className="p-3 flex items-center space-x-3">
                      <Image
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="font-semibold">{item.product?.name}</p>
                        <p className="text-sm text-gray-400">
                          Variant: {variantObj ? variantObj.name : "N/A"}
                        </p>
                        {item.product?.sku && (
                          <p className="text-xs text-gray-500">
                            SKU: {item.product.sku}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-bold">{item.price}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 font-bold">
                      {formatToEuro(item.price * item.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-6 border-t border-gray-600 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span>Current Status:</span>
              <span
                className={`px-2 py-1 rounded text-sm font-semibold
      ${
        order.status === "pending"
          ? "bg-yellow-500 text-black"
          : order.status === "shipped"
          ? "bg-blue-500 text-white"
          : order.status === "delivered"
          ? "bg-green-600 text-white"
          : order.status === "cancelled"
          ? "bg-red-600 text-white"
          : "bg-gray-500 text-white"
      }
    `}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="flex justify-between">
              <span> Total:</span>
              <span>{formatToEuro(calculateSubtotal())}</span>
            </div>

            {/* <div className="flex justify-between">
              <span> Shipping Fee:</span>
              <span>
                {order.shippingMethod === "standard" ? "4.50" : "8.50"}
              </span>
            </div> */}

            {order.couponCode !== "" && order.discountAmount !== 0 && (
              <>
                <div className="flex justify-between">
                  <span>Coupon Applied:</span>
                  <span className="bg-green-500 px-2 py-1 rounded text-white">
                    {order.couponCode || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Discount Amount:</span>
                  <span className=" px-2 py-1 rounded text-green-500">
                    {formatToEuro(order.discountAmount.toFixed(2)) || "N/A"}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between text-xl font-bold">
              <span>Sub Total:</span>
              <span>{formatToEuro(order.totalAmount)}</span>
            </div>

            <div className="mt-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Update Order Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if (newStatus === "shipped") {
                    setShowTrackingModal(true);
                  } else {
                    handleStatusUpdate(newStatus);
                  }
                  setSelectedStatus(newStatus);
                }}
                className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button className="flex items-center bg-teal-700 hover:bg-teal-900 text-white px-4 py-2 rounded">
              <Printer size={16} className="mr-2" /> Print
            </button>
            <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              <Share size={16} className="mr-2" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* User and Shipping Details */}
      <div className="col-span-2 row-span-5 col-start-5 p-4">
        <div className="bg-dark text-white p-5 rounded-lg text-sm shadow-md max-w-md">
          <h2 className="text-lg font-semibold border-hidden border-gray-700 pb-2 mb-4 flex items-center">
            <span className="border-l-4 border-purple-light-2 pl-2">
              User & Shipping Info
            </span>
          </h2>
          <hr className="mb-4" />

          <div className="flex gap-3 mb-4 items-start">
            <div className="flex flex-col">
              {typeof order.user === "object" ? (
                <>
                  <h3 className="text-md font-bold">{order.user.name}</h3>
                  <p className="text-sm text-gray-400">{order.user.email}</p>
                  <p className="text-sm text-gray-400">ID: {order.user._id}</p>

                  {order.user.totalSpent !== undefined && (
                    <span className="inline-block mt-2 bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded-full w-fit">
                      Total Spent: {formatToEuro(order.user.totalSpent)}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">
                  User ID: {String(order.user)}
                </p>
              )}
            </div>

            <div className="ml-auto self-start">
              <BadgeCheck className="text-yellow" />
            </div>
          </div>

          <div className="border-t border-dashed border-gray-700 pt-4 relative">
            <h4 className="font-semibold mb-2">Delivery address</h4>
            <button className="absolute top-4 right-4 bg-gray-700 p-1 rounded-md hover:bg-gray-600">
              <Pencil className="w-4 h-4 text-gray-300" />
            </button>
            <p>
              Phone:{" "}
              <span className="opacity-75">{order.shippingAddress.phone}</span>
            </p>
            {order.shippingAddress.apartment && (
              <p>
                Apartment:{" "}
                <span className="opacity-75">
                  {order.shippingAddress.apartment}
                </span>
              </p>
            )}
            <p>
              House No:{" "}
              <span className="opacity-75">
                {order.shippingAddress.houseNumber}
              </span>
            </p>
            <p>
              Street:{" "}
              <span className="opacity-75">{order.shippingAddress.street}</span>
            </p>
            <p>
              City:{" "}
              <span className="opacity-75">{order.shippingAddress.city}</span>
            </p>
            {order.shippingAddress.province && (
              <p>
                Province:{" "}
                <span className="opacity-75">
                  {order.shippingAddress.province}
                </span>
              </p>
            )}
            <p>
              Zip Code:{" "}
              <span className="opacity-75">
                {order.shippingAddress.zipCode}
              </span>
            </p>
            <p>
              Country:{" "}
              <span className="opacity-75">
                {order.shippingAddress.country}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-dashed border-gray-700 pt-4">
          <h4 className="font-semibold mb-2">Payment Info</h4>
          <p>
            Method: <span className="opacity-75">{order.paymentMethod}</span>
          </p>
          <p>
            Status: <span className="opacity-75">{order.paymentStatus}</span>
          </p>
        </div>

        <div className="mt-4 border-t border-dashed border-gray-700 pt-4">
          <h4 className="font-semibold mb-2">Additional Info</h4>
          <p>
            Status: <span className="opacity-75">{order.status}</span>
          </p>
          <p>
            Shipping: <span className="opacity-75">{order.shippingMethod}</span>
          </p>
          {order.trackingId && (
            <p>
              Tracking ID:{" "}
              <span className="opacity-75">{order.trackingId}</span>
            </p>
          )}
          {order.trackingUrl && (
            <p>
              Tracking URL:{" "}
              <a
                href={order.trackingUrl}
                target="_blank"
                className="text-blue-400 underline"
              >
                {order.trackingUrl}
              </a>
            </p>
          )}
          {order.deliveryNote && (
            <p>
              Delivery Note:{" "}
              <span className="opacity-75">{order.deliveryNote}</span>
            </p>
          )}
          <p>
            Placed on:{" "}
            <span className="opacity-75">
              {formatDateTime(order.createdAt)}
            </span>
          </p>
          <p>
            Paypal Payment ID:{" "}
            <span className="opacity-75">{order.paypalOrderId || "N/A"}</span>
          </p>
        </div>
      </div>
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Enter Tracking Details</h2>

            <div className="mb-3">
              <label className="block font-medium text-sm text-gray-700 mb-1">
                Tracking ID
              </label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full border p-2 rounded border-gray-400"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700 mb-1">
                Tracking URL
              </label>
              <input
                type="text"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                className="w-full border p-2 rounded border-gray-400"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusUpdate("shipped", trackingId, trackingUrl);
                  setShowTrackingModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetails;
