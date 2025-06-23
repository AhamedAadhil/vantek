"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import {
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
} from "lucide-react";
import SidebarShop from "./SidebarShop";
import PreLoader from "../Common/PreLoader";
import { parseCategoriesFromApiUrl } from "@/helper/parseCategoryFromApiUrl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, usePathname } from "next/navigation";

const ShopWithSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const apiUrl = useSelector((state: RootState) => state.shopFilter.apiUrl);
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [resetSidebar, setResetSidebar] = useState(false); //clear side bar props
  //Fetching all Products
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const clearAllFilters = () => {
    setSelected({});
    setCurrentPage(1);
    setResetSidebar(true); // trigger sidebar reset

    const newParams = new URLSearchParams(); // Empty params
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  // 2. When apiUrl changes, fetch products
  useEffect(() => {
    if (!apiUrl || apiUrl === "") {
      fetchData(1);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${
            process.env.NODE_ENV === "production"
              ? process.env.NEXT_PUBLIC_BASEURL
              : process.env.NEXT_PUBLIC_BASEURL_LOCAL
          }${apiUrl}` || apiUrl
        );
        const data = await res.json();

        setProducts(data.products || []);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  // LocalStorage
  const CACHE_EXPIRY_MS = 1000 * 60 * 30; // 30 minutes cache (1000 ms * 60 sec * 30 min)

  const buildCacheKey = (page: number, filters: Record<string, string[]>) => {
    // Include page and filters in cache key for uniqueness
    const filterKey = JSON.stringify(filters);
    return `products_cache_page_${page}_filters_${filterKey}`;
  };

  const fetchData = async (page = 1) => {
    if (page < 1) page = 1;
    setLoading(true);
    const cacheKey = buildCacheKey(page, selected);

    // Try reading from cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          setProducts(data.products);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
          setTotalProducts(data.totalProducts);
          setLoading(false);
          return; // Use cached data, skip fetch
        }
      } catch (e) {
        setLoading(false);
        // If parsing error, ignore cache and fetch fresh
        console.warn("Invalid cache, fetching fresh data");
      }
    }

    // No valid cache, fetch from API
    try {
      const searchParams = new URLSearchParams({ page: String(page) });

      // Parse category filters
      Object.entries(selected).forEach(([key, values]) => {
        const [main, sub] = key.split("--");
        if (values.length > 0) {
          searchParams.set("mainCategory", main);
          searchParams.set("subCategory1", sub);
          searchParams.set("subCategory2", values.join(",")); // comma-separated
          searchParams.set("isVisible", "true");
        }
      });

      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/products?${searchParams.toString()}`
      );
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);

        // Cache the response with timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: Date.now(),
            data,
          })
        );
        setLoading(false);
      } else {
        console.error("❌ API Error:", data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [selected, currentPage]);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const categories = parseCategoriesFromApiUrl(apiUrl);

  return (
    <>
      {loading && <PreLoader />}
      <Breadcrumb
        title={
          categories
            ? `Result for ${categories.subCategory1} in ${categories.mainCategory}`
            : "Explore All Products"
        }
        pages={["shop"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -bottom-10 -right-94 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-blues-200 shadow-1`}
              >
                <ArrowRightLeft />
              </button>

              {/* <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-blues-200 shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <ArrowRightLeft />
              </button> */}

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button onClick={clearAllFilters} className="text-blue">
                        Clean All
                      </button>
                    </div>
                  </div>
                  <SidebarShop selected={selected} setSelected={setSelected} resetSidebar={resetSidebar} setResetSidebar={setResetSidebar}/>
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} />

                    <p>
                      Showing{" "}
                      <span className="text-dark">
                        {products.length} of {totalProducts}
                      </span>{" "}
                      Products
                    </p>
                  </div>

                  {/* <!-- top bar right --> */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="button for product grid tab"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <Grid />
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="button for product list tab"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <List />
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid Tab Content Start --> */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {products.map((item, key) =>
                  productStyle === "grid" ? (
                    <SingleGridItem item={item} key={key} />
                  ) : (
                    <SingleListItem item={item} key={key} />
                  )
                )}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <ul className="flex items-center">
                    <li>
                      <button
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                      >
                        <ChevronLeft />
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li key={page}>
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                              page === currentPage
                                ? "bg-blue text-white"
                                : "hover:text-white hover:bg-blue"
                            }`}
                          >
                            {page}
                          </button>
                        </li>
                      )
                    )}

                    <li>
                      <button
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] hover:text-white hover:bg-blue disabled:text-gray-4"
                      >
                        <ChevronRight />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
