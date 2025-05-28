"use client";

import { Star, ChevronDown, Plus, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { idText } from "typescript";

const statusStyles = {
  Active: "bg-green-500 text-white px-2 py-1 rounded text-xs",
  Inactive: "bg-red-500 text-white px-2 py-1 rounded text-xs",
};

const BannerList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [banners, setBanners] = useState([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setBase64Image(reader.result);
        } else {
          console.error("Unexpected file reader result type.");
          setBase64Image("");
        }
      };
      reader.readAsDataURL(file);
    } else {
      setBase64Image("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!accepted) return;
    if (!base64Image) {
      setMessage("Please upload an image.");
      return;
    }

    const payload = {
      title,
      code,
      description,
      percentage,
      image: base64Image,
      link,
      startDate,
      endDate,
    };

    try {
      setLoading(true);

      const res = await fetch("/api/admin/carousel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create promo.");
      }

      setMessage("Promo created successfully!");
      setTimeout(() => {
        setIsOpen(false);
        // Reset form
        setTitle("");
        setCode("");
        setDescription("");
        setPercentage("");
        setImage(null);
        setBase64Image("");
        setLink("");
        setStartDate("");
        setEndDate("");
        setAccepted(false);
      }, 1500);
      fetchBanners();
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/carousel?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete banner.");
      }
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/carousel");
      if (!res.ok) {
        throw new Error("Failed to fetch banners.");
      }
      const data = await res.json();
      setBanners(data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="p-6 rounded-lg text-white text-sm">
      <div className="bg-[#1f1f1f] p-3 rounded-md mb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p>
            Total number of offers active up to now :{" "}
            <span className="text-green-400 font-semibold">
              {banners?.filter((banner) => banner.isActive).length}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-800 px-3 py-2 rounded-lg outline-none w-full sm:w-60"
              />
              <button className="bg-gray-700 px-4 py-2 ml-2 rounded-lg hover:bg-gray-600 whitespace-nowrap">
                Search
              </button>
            </div>

            <button
              className="bg-blue-light hover:bg-blue-dark text-white px-4 py-2 rounded-lg flex items-center justify-center w-full sm:w-auto"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="mr-1" size={16} />
              Create Promo
            </button>

            {/* PopUp Form Begins */}
            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
                <div className="bg-[#121212] text-white rounded-xl p-6 w-full max-w-xl shadow-lg relative">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-xl font-semibold mb-6">Create a Promo</h2>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Promo Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Promo Code
                        </label>
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Promo Description
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Promo Link
                      </label>
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                        placeholder="https://example.com/promo"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          OFF Percentage
                        </label>
                        <input
                          type="number"
                          value={percentage}
                          onChange={(e) => setPercentage(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md px-3 py-2 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2 text-sm file:text-white file:bg-blue-600 file:border-none file:px-4 file:py-1 file:rounded"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={accepted}
                        onChange={() => setAccepted(!accepted)}
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300">
                        By submitting this form I&apos;m creating a new Promo
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!accepted}
                      className={`w-full py-2 rounded-md font-medium transition ${
                        accepted
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      CREATE
                    </button>

                    {message && (
                      <p className="text-center text-sm text-gray-400 mt-2">
                        {message}
                      </p>
                    )}
                    {loading && (
                      <p className="text-center text-sm text-blue-400 mt-1">
                        Submitting...
                      </p>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {banners?.map((banner) => (
          <div
            key={banner?._id}
            className="bg-[#202020] p-4 rounded-lg space-y-4 border border-gray-800 hover:shadow-lg transition duration-200"
          >
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
              {/* Promo Image */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={banner?.image}
                  alt="Promo Image"
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              </div>

              {/* Title & Discount */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-white">
                    {banner?.title}
                  </p>
                  <p className="text-green-400 text-sm">
                    OFF Percentage: {banner?.percentage}%
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p className="text-white font-medium">Promo Code:</p>
                  <p className="font-mono">{banner?.code}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-700 pt-3 text-sm text-gray-300">
              <p className="font-medium text-white">Promo Description:</p>
              <p className="mt-1">{banner?.description}</p>
            </div>

            {/* Dates & Link */}
            <div className="text-xs text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span>Start Date: {banner?.startDate || "N/A"}</span>
                <span>End Date: {banner?.endDate || "N/A"}</span>
              </div>
              {banner?.link && (
                <div className="mt-1">
                  <p className="text-white">Promo Link:</p>
                  <a
                    href={banner?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline break-words"
                  >
                    {banner?.link}
                  </a>
                </div>
              )}
            </div>

            {/* Status & Buttons */}
            <div className="flex justify-between items-center pt-3">
              <p className="text-sm">
                Status:{" "}
                <span
                  className={
                    statusStyles[banner?.isActive ? "Active" : "Inactive"]
                  }
                >
                  {banner?.isActive ? "Active" : "Inactive"}
                </span>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(banner?._id)}
                  className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 text-xs"
                >
                  Delete
                </button>
                {/* <button className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-xs">
                  Edit
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerList;
