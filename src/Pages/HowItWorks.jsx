import React from "react";
import {
  FaUserPlus,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: (
        <FaUserPlus className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E5CBB8]" />
      ),
      title: "1. Create Account",
      desc: "Register quickly using your email or Google account.",
    },
    {
      icon: (
        <FaFileInvoiceDollar className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E5CBB8]" />
      ),
      title: "2. View Your Bills",
      desc: "Check your latest electricity, gas, and internet bills in one place.",
    },
    {
      icon: (
        <FaMoneyCheckAlt className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E5CBB8]" />
      ),
      title: "3. Pay Securely",
      desc: "Make secure payments with instant confirmation and receipts.",
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
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-6 text-center">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          How <span className="text-[#E5CBB8]">SmartBills</span> Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 md:p-6 rounded-xl hover:scale-105 transition"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex justify-center mb-3 sm:mb-4">
                {step.icon}
              </div>
              <h3
                className="text-lg sm:text-xl md:text-2xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm sm:text-base md:text-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
