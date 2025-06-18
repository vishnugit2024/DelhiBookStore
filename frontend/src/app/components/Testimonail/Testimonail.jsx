"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star } from "lucide-react";
import Image from "next/image";
import testi1 from "../../Images/DowloadImage/Testi1.jpg";
import testi2 from "../../Images/DowloadImage/Testi2.jpg";
import testi3 from "../../Images/DowloadImage/testi3.jpg";
import testi4 from "../../Images/DowloadImage/testi4.jpg";
import testi5 from "../../Images/DowloadImage/testi5.jpg";
import testi6 from "../../Images/DowloadImage/testi6.jpg";
import testi7 from "../../Images/DowloadImage/testi7.jpg";
import testi8 from "../../Images/DowloadImage/Testi1.jpg";
import testi9 from "../../Images/DowloadImage/testi9.jpg";
import testi10 from "../../Images/DowloadImage/testi10.jpg";
const Testimonial = () => {
  const testimonials = [
    {
      name: "Anjali Sharma",
      rating: 4.5,
      count: 58,
      message:
        "Amazing collection of academic and reference books. Fast delivery and great packaging!",
      image: testi1,
    },
    {
      name: "Priya Verma",
      rating: 4,
      count: 46,
      message:
        "I found all my engineering textbooks at discounted prices. Highly recommend this bookstore!",
      image: testi2,
    },
    {
      name: "Rani Mehra",
      rating: 4.2,
      count: 51,
      message:
        "Books are genuine and in perfect condition. A great place to shop for competitive exam prep.",
      image: testi3,
    },
    {
      name: "Sunita Rani",
      rating: 3.8,
      count: 39,
      message:
        "Delivery was a bit delayed, but the book quality and variety made up for it.",
      image: testi4,
    },
    {
      name: "Karan Patel",
      rating: 4,
      count: 44,
      message:
        "Wide range of subjects and latest editions available. My go-to for semester books.",
      image: testi5,
    },
    {
      name: "Meena Joshi",
      rating: 4.7,
      count: 62,
      message:
        "Love the quick service and amazing collection of medical and pharmacy books.",
      image: testi6,
    },
    {
      name: "Nikhil Das",
      rating: 3.9,
      count: 41,
      message:
        "Good stock of IT and coding books. Would love to see more regional language titles.",
      image: testi7,
    },
    {
      name: "Anjali Gupta",
      rating: 4.6,
      count: 59,
      message:
        "They had every book I needed for GATE preparation. Excellent discounts too!",
      image: testi8,
    },
    {
      name: "Rajesh Yadav",
      rating: 4,
      count: 50,
      message:
        "Customer support helped me track a rare book. Great service and trusted seller.",
      image: testi9,
    },
    {
      name: "Sneha Iyer",
      rating: 3.5,
      count: 36,
      message:
        "Good experience overall, but would appreciate faster delivery to smaller towns.",
      image: testi10,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Our Customers</h2>
        <p className="text-sm text-gray-500">
          Honest feedback from our valued customers.
        </p>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={5}
        navigation
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow hover:shadow-md transition text-sm h-full">
              <Image
                src={t.image}
                alt={t.name}
                className="w-12 h-12 mx-auto rounded-full object-cover mb-2"
              />
              <h4 className="font-semibold text-gray-800">{t.name}</h4>
              <div className="flex justify-center items-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(t.rating) ? "#facc15" : "none"}
                    stroke="#facc15"
                  />
                ))}
                <span className="text-xs text-gray-600 ml-1">{t.count}</span>
              </div>

              <hr className="my-2" />
              <p className="text-gray-600 text-xs">{t.message}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
