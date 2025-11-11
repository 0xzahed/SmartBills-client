import React from "react";
import {
  FaUserPlus,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUserPlus className="text-4xl text-[#E5CBB8]" />,
      title: "1. Create Account",
      desc: "Register quickly using your email or Google account.",
    },
    {
      icon: <FaFileInvoiceDollar className="text-4xl text-[#E5CBB8]" />,
      title: "2. View Your Bills",
      desc: "Check your latest electricity, gas, and internet bills in one place.",
    },
    {
      icon: <FaMoneyCheckAlt className="text-4xl text-[#E5CBB8]" />,
      title: "3. Pay Securely",
      desc: "Make secure payments with instant confirmation and receipts.",
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
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2
          className="text-3xl font-bold mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          How <span className="text-[#E5CBB8]">SmartBills</span> Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="p-6 rounded-xl hover:scale-105 transition"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
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
