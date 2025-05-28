import { RootState, AppDispatch } from "@/redux/store";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const Billing = ({
  formValues,
  setFormValues,
  isUk,
  setIsUk,
}: {
  formValues: any;
  setFormValues: (data: any) => void;
  isUk: boolean;
  setIsUk: (val: boolean) => void;
}) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (name === "countryName") {
      setIsUk(value !== "OutsideUK");
    }
  };

  // You can initialize isUk from formValues.countryName
  // useEffect(() => {
  //   setIsUk(formValues.countryName !== "OutsideUK");
  // }, [formValues.countryName,setIsUk]);

  useEffect(() => {
    if (user) {
      setFormValues((prev) => ({
        ...prev,
        firstName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  return (
    <form className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
        {/* Full Name */}
        <div className="w-full">
          <label htmlFor="firstName" className="block mb-2.5">
            Full Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            readOnly
            value={user.name}
            onChange={handleChange}
            placeholder="John"
            className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
          />
        </div>

        {/* Country / Region (UK selector) */}
        <div className="w-full">
          <label htmlFor="countryName" className="block mb-2.5">
            Country / Region <span className="text-red">*</span>
          </label>
          <div className="relative">
            <select
              required
              id="countryName"
              name="countryName"
              value={formValues.countryName}
              onChange={handleChange}
              className="w-full appearance-none rounded-md border border-gray-3 bg-gray-1 px-5 py-3 pr-9"
            >
              <option value="England">England</option>
              <option value="Scotland">Scotland</option>
              <option value="Wales">Wales</option>
              <option value="Northern Ireland">Northern Ireland</option>
              <option value="OutsideUK">Outside the UK</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </span>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2.5">
          Email Address <span className="text-red">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          readOnly
          value={user.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* Street Address */}
      <div className="mb-5">
        <label htmlFor="address" className="block mb-2.5">
          Street Address <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={formValues.address}
          onChange={handleChange}
          placeholder="House number and street name"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
        <input
          type="text"
          id="addressTwo"
          name="addressTwo"
          value={formValues.addressTwo}
          onChange={handleChange}
          placeholder="Apartment, suite, unit, etc. (optional)"
          className="mt-5 w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* House Number */}
      <div className="mb-5">
        <label htmlFor="houseNumber" className="block mb-2.5">
          House Number <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="houseNumber"
          name="houseNumber"
          required
          value={formValues.houseNumber || ""}
          onChange={handleChange}
          placeholder="e.g., 79"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        />
      </div>

      {/* Town / City */}
      <div className="mb-5">
        <label htmlFor="town" className="block mb-2.5">
          Town / City <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="town"
          name="town"
          required
          value={formValues.town}
          onChange={handleChange}
          placeholder="Your city"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* Country (only when non-UK) */}
      {!isUk && (
        <div className="mb-5">
          <label htmlFor="country" className="block mb-2.5">
            Country Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            value={formValues.country}
            onChange={handleChange}
            placeholder="Your country"
            className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
          />
        </div>
      )}

      {/* Phone */}
      <div className="mb-5">
        <label htmlFor="phone" className="block mb-2.5">
          Phone <span className="text-red">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formValues.phone}
          onChange={handleChange}
          placeholder="+1 234 567 890"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* ZIP Code */}
      <div className="mb-5">
        <label htmlFor="zipCode" className="block mb-2.5">
          Postcode / ZIP <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          required
          value={formValues.zipCode}
          onChange={handleChange}
          placeholder="BS1 2AA"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* Province */}
      <div className="mb-5">
        <label htmlFor="province" className="block mb-2.5">
          Province <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="province"
          name="province"
          required
          value={formValues.province}
          onChange={handleChange}
          placeholder="Avon"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>
    </form>
  );
};

export default Billing;
