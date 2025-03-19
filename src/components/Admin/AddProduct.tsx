'use client'
import React, { useState } from 'react';
import { LucideUpload, LucideCalendar, LucideClock } from 'lucide-react';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [publishDate, setPublishDate] = useState('2025-03-19');
  const [publishTime, setPublishTime] = useState('10:23 PM');

  return (
    <div className= "m-4 p-6 bg-dark min-h-screen text-white rounded-lg">
      <h2 className="text-2xl font-semibold">Add Products</h2>
      <div className="bg-gray-800 p-6 rounded-lg mt-4 grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Product Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-dark"
              placeholder="Name"
              maxLength={30}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <small className="text-gray-400">*Product Name should not exceed 30 characters</small>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <select className="p-2 rounded bg-gray-700 text-dark" placeholder='Main Category'>
                <option>VW-T5</option>
                <option>VW-T6</option>
                <option>VW-T7</option>
                <option>VW-T7.1</option>
            </select>
            <select className="p-2 rounded bg-gray-700 text-dark" placeholder='Sub Category'>
                <option>Interior</option>
                <option>Exterior</option>
                <option>Alloy Wheels</option>
            </select>
            <select className="p-2 rounded bg-gray-700 text-dark" placeholder='Sub-Sub Category'>
                <option>Front bumber</option>
                <option>Rear Bumper</option>
                <option>Grills</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Product Description</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-dark" rows={3}
              maxLength={1500}
              placeholder="Description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            ></textarea>
            <small className="text-gray-400">*Description should not exceed 500 letters</small>
          </div>
          <div>
            <label className="block mb-1">Tags</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-dark"
              placeholder="Product tags"
              maxLength={30}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 pt-7">
          <div className="grid grid-cols-3 gap-4">
            <input type="text" className="p-2 rounded text-dark" placeholder="Actual Price" />
            <input type="text" className="p-2 rounded text-dark" placeholder="Dealer Price" />
            <input type="text" className="p-2 rounded text-dark" placeholder="Discount in %" />
          </div>

          <div>
            <label className="block mb-1">Product Images</label>
            <div className="border-2 border-dashed p-6 text-center rounded bg-gray-700">
            <input
                className="py-1.5 h-full ps-0 w-full"
                type="file"
                multiple
            />
            </div>
            <small className="text-gray-400">*Image size should be 50 x 50 px</small>
          </div>
        </div>
      </div>

      {/* Publish Details */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg grid grid-cols-2 gap-6">
        <div className=' w-1/4'>
          <label className="block mb-1">Publish Date</label>
          <div className="flex items-center p-2 bg-gray-700 rounded">
            <LucideCalendar className="mr-2" />
            <input type="date" className="bg-transparent w-full border rounded text-white" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
          </div>
          
        </div>
        <div>
          <label className="block mb-1">Publish Time</label>
          <div className="flex items-center p-2 bg-gray-700 rounded">
            <LucideClock className="mr-2" />
            <input type="time" className="bg-transparent w-full text-white" value={publishTime} onChange={(e) => setPublishTime(e.target.value)} />
          </div>
        </div>
      </div>

      <button className="ml-6 mt-6 bg-green-light-3 hover:bg-blue-light-2 text-dark font-semibold px-6 py-2 border-hidden rounded">
        SAVE PRODUCT
      </button>
      <button className="ml-6 mt-6 bg-red-light-3 hover:bg-red-dark text-dark hover:text-white font-semibold px-6 py-2 border-hidden rounded">
        CLEAR
      </button>
    </div>
  );
};

export default AddProduct;
