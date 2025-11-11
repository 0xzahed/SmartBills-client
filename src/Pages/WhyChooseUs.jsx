import React from "react";
import { FaBolt, FaShieldAlt, FaMoneyBillWave, FaClock } from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaBolt className="text-3xl text-[#E5CBB8]" />,
      title: "Fast Payment",
      desc: "Instant bill payments without any delays or long queues.",
    },
    {
      icon: <FaShieldAlt className="text-3xl text-[#E5CBB8]" />,
      title: "Secure Platform",
      desc: "We use advanced encryption to keep your data protected.",
    },
    {
      icon: <FaMoneyBillWave className="text-3xl text-[#E5CBB8]" />,
      title: "Affordable Fees",
      desc: "Zero hidden costs, pay only what’s necessary for your bills.",
    },
    {
      icon: <FaClock className="text-3xl text-[#E5CBB8]" />,
      title: "24/7 Access",
      desc: "Manage your bills anytime, anywhere with full control.",
    },
  ];

  return (
    <section
      className="py-16"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2
          className="text-3xl font-bold mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          Why Choose <span className="text-[#E5CBB8]">SmartBills?</span>
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex justify-center mb-3">{f.icon}</div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
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
