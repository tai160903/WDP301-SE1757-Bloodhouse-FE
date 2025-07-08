"use client";

import { type ReactNode, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  title?: string;
  items: ReactNode[];
  slidesPerView?: number;
}

const Carousel = ({ title, items, slidesPerView = 3 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(slidesPerView);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(Math.min(2, slidesPerView));
      } else {
        setItemsPerView(slidesPerView);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slidesPerView]);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  };

  // Completely different approach using absolute positioning
  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

      <div className="relative group">
        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={goToNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Carousel with clip-path instead of overflow hidden */}
        <div
          ref={containerRef}
          className="relative"
          style={{
            clipPath: "inset(0px 0px 0px 0px)",
            height: "100%",
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="flex-none px-3 py-4"
                style={{
                  width: `${100 / itemsPerView}%`,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {maxIndex > 0 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
