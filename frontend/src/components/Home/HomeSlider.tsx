import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { isMobile } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Item {
  src: string;
  alt: string;
  href?: string;
}

function HeroSlider({ items }: { items: Item[] }) {
  const navigate = useNavigate();
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
            src={item.src}
            alt={item.alt}
            onClick={() => navigate(item.href || "/")}
            className="h-full w-full object-center md:object-cover lg:transition-all lg:duration-700 lg:ease-in-out lg:group-hover:scale-[1.01]"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default HeroSlider;
