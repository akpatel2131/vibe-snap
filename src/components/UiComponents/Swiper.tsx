import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Mousewheel, Pagination } from "swiper/modules";
import { Dispatch, ReactNode, SetStateAction } from "react";
import type { Swiper as SwiperInstance } from "swiper";

export default function SwiperLayout({
  children,
  setActiveIndex,
}: {
  children: ReactNode[];
  setActiveIndex?: Dispatch<SetStateAction<number>>;
}) {
  let swiperRef: SwiperInstance | null = null;
  return (
    <Swiper
      key={children.length} // Force Swiper to reinitialize when slides change
      modules={[Pagination, Mousewheel]}
      spaceBetween={10}
      slidesPerView={1}
      pagination={{ clickable: true }}
      mousewheel={{ forceToAxis: true }}
      onSlideChange={(swiper: SwiperInstance) =>
        setActiveIndex?.(swiper.activeIndex)
      }
      onSwiper={(swiper: SwiperInstance) => (swiperRef = swiper)}
    >
      {children.map((element, index) => (
        <SwiperSlide key={index}>{element}</SwiperSlide>
      ))}
    </Swiper>
  );
}
