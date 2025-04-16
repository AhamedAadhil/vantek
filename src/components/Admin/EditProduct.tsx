'use client'
import React, { useState } from 'react';
import { LucideUpload, LucideCalendar, Clock, Calendar, X } from 'lucide-react';
import ToggleSwitch from '@/components/Admin/ToggleSwitch';
import { useRouter } from 'next/navigation';


const EditProduct = () => {
  const [productName, setProductName] = useState('Grilled Bed');
  const [ActPrice, setActPrice] = useState('48.65');
  const [LabelPrice, setLabelPrice] = useState('30.65');
  const [Disc, setDisc] = useState('25%');
  const [productDescription, setProductDescription] = useState('Steel Comfortable Bed For VW-T5');
  const [publishDate, setPublishDate] = useState('2025-12-05');
  const [topSelling, setTopSelling] = useState(false);
  const [featured, setFeatured] = useState(false);

  const router = useRouter();

  return (
    <div className= "m-4 p-6 bg-dark min-h-screen text-white rounded-lg">
      <h2 className="text-2xl font-semibold">Edit Products Details</h2>
      <div className='flex justify-end'>
      <button className='rounded-2xl bg-reds-500 w-fit p-2 flex flex-end' onClick={() => router.push("/admin/inventoryPage") }><X/></button>
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
            <small className="text-gray-400">*Product Name should not exceed 30 characters</small>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <select className="p-2 rounded bg-meta-2 text-white" placeholder='Main Category'>
                <option>VW-T5</option>
                <option>VW-T6</option>
                <option>VW-T7</option>
                <option>VW-T7.1</option>
            </select>
            <select className="p-2 rounded bg-meta-2 text-white" placeholder='Sub Category'>
                <option>Interior</option>
                <option>Exterior</option>
                <option>Alloy Wheels</option>
            </select>
            <select className="p-2 rounded bg-meta-2 text-white" placeholder='Sub-Sub Category'>
                <option>Front bumber</option>
                <option>Rear Bumper</option>
                <option>Grills</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Product Description</label>
            <textarea
              className="w-full p-2 rounded bg-meta-2 text-white" rows={3}
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
              className="w-full p-2 rounded bg-meta-2 text-white"
              placeholder="Product tags"
              maxLength={30}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 pt-7">
          <div className="grid grid-cols-3 gap-4">
            <input type="text" className="p-2 rounded bg-meta-2 text-white" placeholder="Actual Price" value={ActPrice} onChange={(e) => setActPrice(e.target.value)}/>
            <input type="text" className="p-2 rounded bg-meta-2 text-white" placeholder="Label Price" value={LabelPrice} onChange={(e) => setLabelPrice(e.target.value)}/>
            <input type="text" className="p-2 rounded bg-meta-2 text-white" placeholder="Discount in %" value={Disc} onChange={(e) => setDisc(e.target.value)}/>
          </div>
            <label className="block">Stocks :</label>
            <input type="text" className="p-2 rounded bg-meta-2 text-white" placeholder="Available Stocks" />

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
          <div className='grid grid-cols-3 gap-4'>

            <div className="w-full max-w-md">
                    <label 
                        htmlFor="date-input" 
                        className="block text-sm font-medium text-gray-300 mb-2"
                    >
                        Publish Date
                    </label>
                    <div className="relative rounded-lg overflow-hidden shadow-sm border-hidden transition-all hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                        id="date-input"
                        type="date"
                        className="block w-full pl-10 pr-3 py-2.5 bg-meta-2 text-white placeholder-gray-400 focus:outline-none focus:ring-0 text-sm"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        />
                    </div>
            </div>
            <div className='flex flex-col'>
                <div></div>
                <div className='mt-8 text-white'>

                <ToggleSwitch
                    label="Top Selling Product" 
                    enabled={topSelling}
                    setEnabled={setTopSelling}
                />
                </div>
            </div>
            <div className='flex flex-col'>
                <div></div>
                <div className='mt-8'>

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
      

      <button className="ml-6 mt-6 bg-green-light-3 hover:bg-blue-light-2 text-dark font-semibold px-6 py-2 border-hidden rounded">
        UPDATE PRODUCT
      </button>
      <button className="ml-6 mt-6 bg-red-light-3 hover:bg-red-dark text-dark hover:text-white font-semibold px-6 py-2 border-hidden rounded">
        DELETE PRODUCT
      </button>
    </div>
  );
};

export default EditProduct;
