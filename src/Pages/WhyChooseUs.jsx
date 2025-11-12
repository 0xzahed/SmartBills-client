import React from "react";
import { FaBolt, FaShieldAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: (
        <FaBolt className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E5CBB8]" />
      ),
      title: "Fast Payment",
      desc: "Instant bill payments without any delays or long queues.",
    },
    {
      icon: (
        <FaShieldAlt className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E5CBB8]" />
      ),
      title: "Secure Platform",
      desc: "We use advanced encryption to keep your data protected.",
    },
    {
      icon: (
        <FaMoneyBillWave className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E5CBB8]" />
      ),
      title: "Affordable Fees",
      desc: "Zero hidden costs, pay only what’s necessary for your bills.",
    },
    {
      icon: (
        <FaClock className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E5CBB8]" />
      ),
      title: "24/7 Access",
      desc: "Manage your bills anytime, anywhere with full control.",
    },
  ];

  return (
    <section
      className="py-8 sm:py-12 md:py-14 lg:py-16"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          Why Choose <span className="text-[#E5CBB8]">SmartBills?</span>
        </h2>

        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 md:p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex justify-center mb-2 sm:mb-3">{f.icon}</div>
              <h3
                className="text-lg sm:text-xl md:text-2xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p
                className="text-xs sm:text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
