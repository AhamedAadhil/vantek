import { updateUserAddress } from "@/redux/features/authSlice";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AddressModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const address = user?.address?.[0] || {};

  const [formData, setFormData] = useState({
    phone: "",
    houseNumber: "",
    apartment: "",
    street: "",
    city: "",
    province: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    setFormData({
      phone: address.phone || "",
      houseNumber: address.houseNumber || "",
      apartment: address.apartment || "",
      street: address.street || "",
      city: address.city || "",
      province: address.province || "",
      zipCode: address.zipCode || "",
      country: address.country || "",
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/me/update-address`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            userId: user?._id,
          },
          body: JSON.stringify({ address: formData }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        // alert(data.message || "Failed to update address");
        toast.error(data.message || "Failed to update address");
      } else {
        dispatch(updateUserAddress(data.address));
        toast.success("Address updated successfully!");
        closeModal();
      }
    } catch (err) {
      toast.error("Failed to update address: ", err.message);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  return (
    <div
      className={`fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5 ${
        isOpen ? "block z-99999" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={closeModal}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-3 sm:right-3 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <X />
          </button>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <label htmlFor="name" className="block mb-2.5">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={user?.name || ""}
                    disabled
                    readOnly
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="email" className="block mb-2.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user?.email || ""}
                    disabled
                    readOnly
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <label htmlFor="phone" className="block mb-2.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="houseNumber" className="block mb-2.5">
                    House Number
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <label htmlFor="apartment" className="block mb-2.5">
                    Apartment
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="street" className="block mb-2.5">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <label htmlFor="city" className="block mb-2.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="province" className="block mb-2.5">
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <label htmlFor="zipCode" className="block mb-2.5">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="country" className="block mb-2.5">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
