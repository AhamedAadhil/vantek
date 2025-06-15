"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import AddressModal from "./AddressModal";
import Orders from "../Orders";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout, updateUserName } from "@/redux/features/authSlice";
import { removeAllItemsFromWishlist } from "@/redux/features/wishlist-slice";
import {
  ChevronDown,
  Edit,
  House,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShoppingBasket,
  User,
  User2,
  Eye,
  EyeOff,
} from "lucide-react";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";
import { formatDateTime } from "@/helper/formatDateTime";
import { generateAvatarUrl } from "@/helper/generateAvatarUrl";
import { toast } from "sonner";

const MyAccount = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("account-details");
  const [addressModal, setAddressModal] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    updatedAt: user?.updatedAt,
    role: user?.role,
    isActive: user?.isActive,
    totalSpent: user?.totalSpent,
  });
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddressModal = () => {
    setAddressModal(true);
  };

  const closeAddressModal = () => {
    setAddressModal(false);
  };

  const handleLogout = async () => {
    const res = await fetch(
      `${
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BASEURL
          : process.env.NEXT_PUBLIC_BASEURL_LOCAL
      }/logout`
    );
    const data = await res.json();
    console.log("Logout response:", data);
    if (data.success) {
      router.replace("/");
      dispatch(removeAllItemsFromWishlist());
      dispatch(removeAllItemsFromCart());
      dispatch(logout());
      toast.success("Logging out...");
    }
    // toast.error("Logout failed. Please try again.");
  };

  const handleUpdateName = async (name: string) => {
    const res = await fetch(
      `${
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BASEURL
          : process.env.NEXT_PUBLIC_BASEURL_LOCAL
      }/me/update-name`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      dispatch(updateUserName(data.name));
      toast.success("Name updated to " + data.name + " successfully!");
      return;
    }
    toast.error("Name update failed: " + data.message);
    console.log("Name update failed", data.message);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const { oldPassword, newPassword, confirmNewPassword } = passwordFormData;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/me/update-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.error || "Password update failed");
        return;
      }

      setMessage("Password updated successfully. Logging out...");
      toast.success("Password updated successfully. Logging out...");
      // Wait a second before redirecting
      setTimeout(() => {
        handleLogout();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Breadcrumb title={"My Account"} pages={["my account"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">
            {/* <!--== user dashboard menu start ==--> */}
            <div className="xl:max-w-[370px] w-full h-fit bg-white rounded-xl shadow-1">
              <div className="flex xl:flex-col">
                <div className="hidden lg:flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                  <div className="max-w-[64px] w-full h-16 rounded-full overflow-hidden">
                    <Image
                      src={generateAvatarUrl(user?.email)}
                      alt="user"
                      width={64}
                      height={64}
                    />
                  </div>

                  <div>
                    <p className="font-medium text-dark mb-0.5">{user?.name}</p>
                    <p className="text-custom-xs">
                      `Member Since {formatDateTime(user?.createdAt)}`
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-7.5 xl:p-9">
                  <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-4">
                    <button
                      onClick={() => setActiveTab("account-details")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "account-details"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <User size={19} />
                      Account Details
                    </button>

                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "orders"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <ShoppingBasket size={19} />
                      Orders
                    </button>

                    <button
                      onClick={() => setActiveTab("addresses")}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "addresses"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <House size={19} />
                      Addresses
                    </button>

                    <button
                      onClick={() => handleLogout()}
                      className={`flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white ${
                        activeTab === "logout"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <LogOut size={19} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* <!--== user dashboard menu end ==-->

          <!-- orders tab content start --> */}
            <div
              className={`xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 ${
                activeTab === "orders" ? "block" : "hidden"
              }`}
            >
              <Orders />
            </div>
            {/* <!-- orders tab content end -->

          <!-- downloads tab content start --> */}
            <div
              className={`xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10 ${
                activeTab === "downloads" ? "block" : "hidden"
              }`}
            >
              <p>You don&apos;t have any download</p>
            </div>
            {/* <!-- downloads tab content end -->

          <!-- addresses tab content start --> */}
            <div
              className={`flex-col sm:flex-row gap-7.5 ${
                activeTab === "addresses" ? "flex" : "hidden"
              }`}
            >
              <div className="xl:max-w-[370px] w-full bg-white shadow-1 rounded-xl">
                <div className="flex items-center justify-between py-5 px-4 sm:pl-7.5 sm:pr-6 border-b border-gray-3">
                  <p className="font-medium text-xl text-dark">
                    Shipping Address
                  </p>

                  <button
                    className="text-dark ease-out duration-200 hover:text-blue"
                    onClick={openAddressModal}
                  >
                    <Edit size={18} />
                  </button>
                </div>

                <div className="p-4 sm:p-7.5">
                  <div className="flex flex-col gap-4">
                    <p className="flex items-center gap-2.5 text-custom-sm">
                      <User2 size={18} />
                      Name: {user?.name}
                    </p>

                    <p className="flex items-center gap-2.5 text-custom-sm">
                      <Mail size={18} />
                      Email: {user?.email}
                    </p>

                    <p className="flex items-center gap-2.5 text-custom-sm">
                      <Phone size={18} />
                      Phone: {user?.address?.[0]?.phone || "Not provided"}
                    </p>

                    <p className="flex gap-2.5 text-custom-sm">
                      <MapPin size={18} />
                      Address:{" "}
                      {user?.address?.length > 0 ? (
                        <>
                          {user?.address?.[0].houseNumber},{" "}
                          {user?.address?.[0].street},{" "}
                          {user?.address?.[0].apartment &&
                            `${user?.address?.[0].apartment}, `}
                          {user?.address?.[0].city},{" "}
                          {user?.address?.[0].province},{" "}
                          {user?.address?.[0].zipCode},{" "}
                          {user?.address?.[0].country}
                        </>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- addresses tab content end -->

          <!-- details tab content start --> */}
            <div
              className={`xl:max-w-[770px] w-full ${
                activeTab === "account-details" ? "block" : "hidden"
              }`}
            >
              <form>
                <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="fullName" className="block mb-2.5">
                        Full Name <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.name}
                        maxLength={15}
                        onChange={handleChange}
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>

                    <div className="w-full">
                      <label className="block mb-2.5">Email</label>
                      <input
                        type="text"
                        value={formData.email}
                        disabled
                        className="rounded-md border border-gray-3 bg-gray-2 text-dark-5 w-full py-2.5 px-5 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label className="block mb-2.5">Last Update</label>
                      <input
                        type="text"
                        value={formatDateTime(formData.updatedAt)}
                        disabled
                        className="rounded-md border border-gray-3 bg-gray-2 text-dark-5 w-full py-2.5 px-5 outline-none"
                      />
                    </div>

                    {/* <div className="w-full">
                      <label className="block mb-2.5">Role</label>
                      <input
                        type="text"
                        value={formData.role}
                        disabled
                        className="rounded-md border border-gray-3 bg-gray-2 text-dark-5 w-full py-2.5 px-5 outline-none"
                      />
                    </div> */}

                    <div className="w-full">
                      <label className="block mb-2.5">Status</label>
                      <input
                        type="text"
                        value={formData.isActive ? "Active" : "Inactive"}
                        disabled
                        className="rounded-md border border-gray-3 bg-gray-2 text-dark-5 w-full py-2.5 px-5 outline-none"
                      />
                    </div>
                  </div>

                  {formData.totalSpent > 0 && (
                    <div className="mb-5">
                      <label className="block mb-2.5">Total Spent</label>
                      <input
                        type="text"
                        value={formatToEuro(formData.totalSpent.toFixed(2))}
                        disabled
                        className="rounded-md border border-gray-3 bg-gray-2 text-dark-5 w-full py-2.5 px-5 outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleUpdateName(formData.name)}
                    disabled={!formData.name || formData.name === user?.name}
                    className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    Update Name
                  </button>
                </div>

                <p className="text-custom-sm mt-5 mb-9">
                  * This will be how your name will be displayed in the account
                  section and in reviews
                </p>

                <p className="font-medium text-xl sm:text-2xl text-dark mb-7">
                  Password Change
                </p>

                <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
                  <div className="mb-5 relative">
                    <label htmlFor="oldPassword" className="block mb-2.5">
                      Old Password
                    </label>
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      id="oldPassword"
                      value={passwordFormData.oldPassword}
                      onChange={handlePasswordChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 pr-12 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-4 top-[50px] text-gray-500 hover:text-gray-700"
                    >
                      {showOldPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <div className="mb-5 relative">
                    <label htmlFor="newPassword" className="block mb-2.5">
                      New Password
                    </label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 pr-12 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-[50px] text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <div className="mb-5 relative">
                    <label
                      htmlFor="confirmNewPassword"
                      className="block mb-2.5"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      value={passwordFormData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 pr-12 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      className="absolute right-4 top-[50px] text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {message && (
                    <p className="text-red-500 mb-4 font-medium">*{message}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md hover:bg-blue-dark"
                  >
                    {loading ? "Updating..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
            {/* <!-- details tab content end -->
          <!--== user dashboard content end ==--> */}
          </div>
        </div>
      </section>

      <AddressModal isOpen={addressModal} closeModal={closeAddressModal} />
    </>
  );
};

export default MyAccount;
