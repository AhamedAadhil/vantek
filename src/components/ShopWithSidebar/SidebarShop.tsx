"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import categoryData from "@/data/van_parts_categories.json";

const SidebarShop = ({ selected, setSelected }) => {
  const [openMain, setOpenMain] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  // const [selected, setSelected] = useState<Record<string, string[]>>({});
  // clear all select botton clearing starts
  useEffect(() => {
    // If selected is empty, collapse open dropdowns
    if (Object.keys(selected).length === 0) {
      setOpenMain(null);
      setOpenSub(null);
    }
  }, [selected]);
    // clear all select botton clearing Ends

  const handleMainToggle = (mainCat: string) => {
    setOpenMain(openMain === mainCat ? null : mainCat);
    setOpenSub(null); // close sub on new main
  };

  const handleSubToggle = (subCat: string) => {
    setOpenSub(openSub === subCat ? null : subCat);
  };

  const handleCheckboxChange = (
    main: string,
    sub: string,
    item: string,
    isAll: boolean = false
  ) => {
    const key = `${main}--${sub}`;
    const existing = selected[key] || [];

    let updated: string[];
    if (isAll) {
      const allValues = categoryData[main][sub] as string[];
      updated = allValues; // Select all real options
    } else {
      updated = existing.includes(item)
        ? existing.filter((i) => i !== item)
        : [...existing, item];
    }

    setSelected({ ...selected, [key]: updated });
  };

  const isAllChecked = (main: string, sub: string) => {
    const key = `${main}--${sub}`;
    const allItems = categoryData[main][sub] as string[];
    const selectedItems = selected[key] || [];
    return allItems.every((item) => selectedItems.includes(item));
  };

  const isChecked = (main: string, sub: string, item: string) => {
    const key = `${main}--${sub}`;
    return selected[key]?.includes(item);
  };

  return (
    <div className="space-y-4 p-4 bg-white shadow-md rounded-xl">
      {Object.entries(categoryData).map(([main, subCategories]) => (
        <div key={main}>
          <button
            onClick={() => handleMainToggle(main)}
            className="w-full flex justify-between items-center font-medium"
          >
            <span>{main}</span>
            {openMain === main ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {openMain === main && (
            <div className="mt-2 pl-3">
              {Object.entries(subCategories).map(([sub, subSubArray]) => (
                <div key={sub} className="mt-2">
                  <button
                    onClick={() => handleSubToggle(sub)}
                    className="w-full flex justify-between items-center font-medium text-sm text-gray-700"
                  >
                    <span>{sub}</span>
                    {openSub === sub ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {openSub === sub && (
                    <div className="pl-4 mt-1 space-y-1">
                      {/* All Option */}
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isAllChecked(main, sub)}
                          onChange={() =>
                            handleCheckboxChange(main, sub, "All", true)
                          }
                          className="accent-blue-600"
                        />
                        <span>All</span>
                      </label>

                      {/* SubSubCategories */}
                      {(subSubArray as string[]).length > 0 ? (
                        (subSubArray as string[]).map((item) => (
                          <label
                            key={item}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked(main, sub, item)}
                              onChange={() =>
                                handleCheckboxChange(main, sub, item)
                              }
                              className="accent-blue-600"
                            />
                            <span>{item}</span>
                          </label>
                        ))
                      ) : (
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={isChecked(main, sub, "All")}
                            onChange={() =>
                              handleCheckboxChange(main, sub, "All")
                            }
                            className="accent-blue-600"
                          />
                          <span>All</span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarShop;
