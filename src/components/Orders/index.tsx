import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";

const Orders = () => {
  const [orders, setOrders] = useState<any>([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/me/orders`
      );
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-fit">
          {/* <!-- order item --> */}
          {orders?.length > 0 && (
            <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
              <div className="min-w-[111px]">
                <p className="text-custom-sm text-dark">Order</p>
              </div>
              <div className="min-w-[175px]">
                <p className="text-custom-sm text-dark">Date</p>
              </div>
              <div className="min-w-[128px]">
                <p className="text-custom-sm text-dark">Status</p>
              </div>
              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">Total</p>
              </div>
              <div className="min-w-[113px] pl-8">
                <p className="text-custom-sm text-dark">Action</p>
              </div>
            </div>
          )}


          {orders?.length > 0 ? (
            orders?.map((orderItem) => (
              <SingleOrder
                key={orderItem._id}
                orderItem={orderItem}
                smallView={false}
              />
            ))
          ) : (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">
              You don't have any orders!
            </p>
          )}

          {orders?.length > 0 &&
            orders.map((orderItem) => (
              <SingleOrder
                key={orderItem._id}
                orderItem={orderItem}
                smallView={true}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Orders;
