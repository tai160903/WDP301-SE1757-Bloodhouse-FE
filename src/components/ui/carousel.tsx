import { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CarouselProps {
  title?: string;
  items: ReactNode[];
  slidesPerView?: number;
}

const Carousel = ({ title, items, slidesPerView = 3 }: CarouselProps) => {
  return (
    <div>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        navigation
        autoHeight={true}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="h-full">{item}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
