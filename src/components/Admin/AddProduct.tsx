"use client";
import React, { useState } from "react";
import { LucideUpload, LucideCalendar, Clock, Calendar, X } from "lucide-react";
import ToggleSwitch from "@/components/Admin/ToggleSwitch";
import Image from "next/image";

interface AddProductProps {
  onClose: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onClose }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [topSelling, setTopSelling] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory1, setSubCategory1] = useState("");
  const [subCategory2, setSubCategory2] = useState("");
  const [ActPrice, setActPrice] = useState<number>();
  const [LabelPrice, setLabelPrice] = useState<number>();
  const [stock, setStock] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [tags, setTags] = useState<string[]>([]);


  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveProduct = () => {
    const productData = {
      name: productName,
      description: productDescription,
      mainCategory: mainCategory as
        | "VW-T5"
        | "VW-T6.1"
        | "VW-T7"
        | "Universal Camper Parts",
      subCategory1,
      subCategory2,
      tags,
      labelPrice: LabelPrice || 0,
      actualPrice: ActPrice || 0,
      images: base64Images,
      topSellingProduct: topSelling,
      featuredProduct: featured,
      isVisible,
      stock
    };
  
    console.log("🚀 Product Data:", productData);
  };
  
  return (
    <div className="m-4 p-6 bg-dark min-h-screen text-white rounded-lg">
      <h2 className="text-2xl font-semibold">Add Products</h2>
      <div className="flex justify-end">
        <button
          className="rounded-2xl bg-reds-500 w-fit p-2 flex flex-end"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg mt-4 grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Product Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-meta-2 text-white"
              placeholder="Name"
              maxLength={30}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <small className="text-gray-400">
              *Product Name should not exceed 30 characters
            </small>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <select
              className="p-2 rounded bg-meta-2 text-white"
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
            >
              <option value="">Select Main Category</option>
              <option value="VW-T5">VW-T5</option>
              <option value="VW-T6.1">VW-T6.1</option>
              <option value="VW-T7">VW-T7</option>
              <option value="Universal Camper Parts">
                Universal Camper Parts
              </option>
            </select>
            <select
              className="p-2 rounded bg-meta-2 text-white"
              placeholder="Sub Category 1"
              value={subCategory1}
              onChange={(e) => setSubCategory1(e.target.value)}
            >
              <option>Interior</option>
              <option>Exterior</option>
              <option>Alloy Wheels</option>
            </select>
            <select
              className="p-2 rounded bg-meta-2 text-white"
              placeholder="Sub-Category 2"
              value={subCategory2}
              onChange={(e) => setSubCategory2(e.target.value)}
            >
              <option>Front bumber</option>
              <option>Rear Bumper</option>
              <option>Grills</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Product Description</label>
            <textarea
              className="w-full p-2 rounded bg-meta-2 text-white"
              rows={3}
              maxLength={1500}
              placeholder="Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            ></textarea>
            <small className="text-gray-400">
              *Description should not exceed 500 letters
            </small>
          </div>
          <div>
            <label className="block mb-1">Tags</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-meta-2 text-white"
              placeholder="Comma-separated tags (e.g. camper,bumper,roof)"
              maxLength={100}
              onChange={(e) =>
                setTags(e.target.value.split(",").map((tag) => tag.trim()))
              }
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 pt-7">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block">Actual Price :</label>
              <input
                type="number"
                className="p-2 rounded bg-meta-2 text-white"
                placeholder="Actual Price"
                value={ActPrice}
                onChange={(e) => setActPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block">Label Price :</label>
              <input
                type="number"
                className="p-2 rounded bg-meta-2 text-white"
                placeholder="Label Price"
                value={LabelPrice}
                onChange={(e) => setLabelPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block">Stocks :</label>
              <input
                type="number"
                className="p-2 rounded bg-meta-2 text-white"
                placeholder="Available Stocks"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Product Images</label>
            <div className="border-2 border-dashed p-6 text-center rounded bg-gray-700">
              <input
                className="py-1.5 h-full ps-0 w-full"
                type="file"
                multiple
                accept="image/*"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (files) {
                    const fileArray = Array.from(files);

                    // Convert files to preview URLs for UI
                    const imageUrls = fileArray.map((file) =>
                      URL.createObjectURL(file)
                    );
                    setImages((prev) => [...prev, ...imageUrls]);

                    // Convert files to base64 strings
                    const base64Strings = await Promise.all(
                      fileArray.map(async (file) => await convertToBase64(file))
                    );
                    setBase64Images((prev) => [...prev, ...base64Strings]);
                  }
                }}
              />
            </div>
            <small className="text-gray-400">
              *Image size should be 50 x 50 px
            </small>

            <div className="flex flex-wrap mt-4 gap-2">
              {images.map((src, idx) => (
                <Image
                  key={idx}
                  className="bg-meta-5 rounded-lg bg-opacity-50"
                  src={src}
                  alt={`product preview ${idx + 1}`}
                  width={100}
                  height={100}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <div></div>
              <div className="mt-8">
                <ToggleSwitch
                  label="Top Selling Product"
                  enabled={topSelling}
                  setEnabled={setTopSelling}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div></div>
              <div className="mt-8">
                <ToggleSwitch
                  label="Featured Product"
                  enabled={featured}
                  setEnabled={setFeatured}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Details */}

      <button className="ml-6 mt-6 bg-green-light-3 hover:bg-blue-light-2 text-dark font-semibold px-6 py-2 border-hidden rounded" onClick={handleSaveProduct}>
        SAVE PRODUCT
      </button>
      <button className="ml-6 mt-6 bg-red-light-3 hover:bg-red-dark text-dark hover:text-white font-semibold px-6 py-2 border-hidden rounded">
        CLEAR
      </button>
    </div>
  );
};

export default AddProduct;
