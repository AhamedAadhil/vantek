"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import { useEffect, useState } from "react";

const HeroCarousal = () => {
  const [banners, setBanners] = useState([]);
  const CACHE_KEY = "carousel_banners";
  const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 hour cache (1000 ms * 60 sec * 60 min)

  const fetchBanners = async () => {
    try {
      // const cached = localStorage.getItem(CACHE_KEY);
      // if (cached) {
      //   const { timestamp, data } = JSON.parse(cached);
      //   const isCacheValid = Date.now() - timestamp < CACHE_EXPIRY_MS;
      //   const isDataValid = Array.isArray(data) && data.length > 0;

      //   if (isCacheValid && isDataValid) {
      //     setBanners(data);
      //     return;
      //   }
      // }

      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/carousel`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch banners.");
      }

      const result = await res.json();
      const fetchedBanners = result.data || [];

      setBanners(fetchedBanners);

      // if (fetchedBanners.length > 0) {
      //   localStorage.setItem(
      //     CACHE_KEY,
      //     JSON.stringify({ timestamp: Date.now(), data: fetchedBanners })
      //   );
      // }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  console.log("Banners:", banners);

  // if (banners.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <p className="text-gray-500">No banners available at the moment.</p>
  //     </div>
  //   );
  // }
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={banner._id || index}>
          <div className="flex min-h-[535px] items-center justify-between pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  {banner.percentage || "0"}%
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  Sale
                  <br />
                  Off
                </span>
              </div>
              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <a href={banner.link || "#"}>{banner.title}</a>
              </h1>
              <p>{banner.description}</p>
              <a
                href={banner.link || "#"}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                Shop Now
              </a>
            </div>

            <div className="mr-5">
              <Image
                src={banner.image}
                alt={banner.title}
                width={351}
                height={358}
                className="object-cover"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
