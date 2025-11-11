import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import manageUtility from "../../assets/images/manage-utility-easily.jpg";
import paySecurely from "../../assets/images/Pay Securely & Instantly.jpg";
import monthlyExpenses from "../../assets/images/Monthly Expenses, Organize.jpg";

import "swiper/css";
import "swiper/css/pagination";
import { motion as Motion } from "framer-motion";

const Header = () => {
  const slides = [
    {
      id: 1,
      title: "Manage Your Utility Bills Easily",
      desc: "Track, manage, and pay all your monthly utility bills — Electricity, Gas, Water, and Internet — in one secure platform.",
      img: manageUtility,
      btn1: "Get Started",
      btn2: "View Bills",
    },
    {
      id: 2,
      title: "Pay Securely & Instantly",
      desc: "Enjoy fast and secure bill payments with our integrated system — no delays, no hassles.",
      img: paySecurely,
      btn1: "Pay Now",
      btn2: "Learn More",
    },
    {
      id: 3,
      title: "Your Monthly Expenses, Organized",
      desc: "Stay on top of your payments with real-time tracking and downloadable PDF reports of your paid bills.",
      img: monthlyExpenses,
      btn1: "My Pay Bills",
      btn2: "Explore Features",
    },
  ];

  return (
    <div className="w-full bg-[#F9F5F3]">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="grid md:grid-cols-2 items-center gap-10 px-6 md:px-16 py-10">
              
              <Motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-left space-y-6"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-gray-600 text-base md:text-lg">
                  {slide.desc}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-all duration-300">
                    {slide.btn1} →
                  </button>
                  <button className="border border-black px-6 py-3 rounded-md font-medium hover:bg-black hover:text-white transition-all duration-300">
                    {slide.btn2}
                  </button>
                </div>
              </Motion.div>

              
              <Motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center"
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="rounded-2xl w-[90%] md:w-[85%] lg:w-[80%] object-cover shadow-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x400/374151/ffffff?text=" +
                      encodeURIComponent(slide.title);
                  }}
                />
              </Motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Header;
