import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { isMobile } from "@/lib/utils";

function HeroSlider({ items }: { items: string[] }) {
  return (
    <Swiper
      style={
        {
          "--swiper-navigation-color": "hsl(var(--primary))",
          "--swiper-pagination-color": "hsl(var(--primary))",
          "--swiper-navigation-size": isMobile() ? "15px" : "35px",
        } as React.CSSProperties
      }
      autoplay={true}
      pagination={{
        clickable: true,
      }}
      loop={true}
      navigation={true}
      modules={[Pagination, Navigation, Autoplay]}
      className="mySwiper h-full w-full"
    >
      {items.map((item, idx) => (
        <SwiperSlide key={idx} className="group h-full w-full">
          <img
            src={item}
            alt={`Slider ${idx}`}
            className="h-full w-full md:object-cover object-center lg:transition-all lg:duration-700 lg:ease-in-out lg:group-hover:scale-[1.01]"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default HeroSlider;
