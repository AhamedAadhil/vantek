"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect } from "react";
import data from "./categoryData";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

const Categories = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="swiper categories-carousel common-carousel">
          {/* <!-- section title --> */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                <Tag size={16} />
                Categories
              </span>
              <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                Browse by Category
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="swiper-button-prev">
                <ChevronLeft />
              </button>

              <button onClick={handleNext} className="swiper-button-next">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-y-4 lg:gap-x-20 justify-between md:justify-center px-2 sm:px-4">
            {data.map((item, key) => (
              <div
                key={key}
                className="w-[22%] sm:w-[18%] md:w-[16%] lg:w-[14%] xl:w-[12%] px-2"
              >
                <SingleItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
