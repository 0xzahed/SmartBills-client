import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const contactData = {
  hero: {
    title: "Contact Us",
    subtitle:
      "Have questions or need help? We're here to assist you. Get in touch with our support team.",
  },
  infoCards: [
    {
      icon: (
        <FaPhone
          className="text-2xl"
          style={{ color: "var(--text-primary)" }}
        />
      ),
      title: "Phone",
      info: "+880 1234-567890",
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: (
        <FaEnvelope
          className="text-2xl"
          style={{ color: "var(--text-primary)" }}
        />
      ),
      title: "Email",
      info: "support@smartbills.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: (
        <FaMapMarkerAlt
          className="text-2xl"
          style={{ color: "var(--text-primary)" }}
        />
      ),
      title: "Office",
      info: "Dhaka, Bangladesh",
      description: "Visit us anytime",
    },
    {
      icon: (
        <FaClock
          className="text-2xl"
          style={{ color: "var(--text-primary)" }}
        />
      ),
      title: "Working Hours",
      info: "9:00 AM - 6:00 PM",
      description: "Monday to Friday",
    },
  ],
  faq: [
    {
      question: "How secure is my payment information?",
      answer:
        "We use bank-level encryption and secure payment gateways to protect your financial data. Your information is never stored on our servers.",
    },
    {
      question: "What bills can I pay through SmartBills?",
      answer:
        "You can pay electricity, gas, water, internet, and phone bills through our platform. We're constantly adding new service providers.",
    },
    {
      question: "Is there a fee for using SmartBills?",
      answer:
        "SmartBills is completely free to use. We don't charge any hidden fees for bill payments or account management.",
    },
    {
      question: "How long does it take to process payments?",
      answer:
        "Most payments are processed instantly. In some cases, it may take up to 24 hours depending on the service provider.",
    },
  ],
};

const ContactUs = () => {
  const { hero, infoCards, faq } = contactData;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Message sent successfully! We'll get back to you soon.");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        minHeight: "100vh",
      }}
    >
      <section
        className="py-20"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Contact <span className="text-[#E5CBB8]">Us</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {hero.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <motion.div
          className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          {infoCards.map((item, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </h3>
              <p
                className="font-medium mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {item.info}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      <motion.section
        className="py-16"
        style={{ backgroundColor: "var(--bg-secondary)" }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <div>
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: "var(--text-primary)" }}
            >
              Send us a <span className="text-[#E5CBB8]">Message</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#E5CBB8]"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#E5CBB8]"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#E5CBB8]"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#E5CBB8]"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E5CBB8] hover:bg-[#d4b89e] text-black font-semibold py-3 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: "var(--text-primary)" }}
            >
              Frequently Asked <span className="text-[#E5CBB8]">Questions</span>
            </h2>

            <div className="space-y-6">
              {faq.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.question}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactUs;
