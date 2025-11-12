import React from "react";
import { FaEye, FaHeart, FaUsers, FaAward } from "react-icons/fa";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  const companyInfo = {
    name: "SmartBills",
    tagline:
      "Making bill management simple, secure, and efficient for everyone.",
    description:
      "Our platform helps you track, organize, and pay your utility bills with ease.",
  };

  const missionVision = {
    mission: {
      title: "Our Mission",
      description:
        "To revolutionize the way people manage their utility bills by providing a comprehensive, user-friendly platform that saves time, reduces stress, and ensures bills are never missed again.",
    },
    vision: {
      title: "Our Vision",
      description:
        "To become the leading digital platform for bill management in Bangladesh, empowering individuals and families to take control of their finances with confidence and ease.",
    },
  };

  const stats = [
    {
      icon: <FaUsers className="text-3xl text-black" />,
      number: "10,000+",
      label: "Happy Customers",
    },
    {
      icon: <FaAward className="text-3xl text-black" />,
      number: "99%",
      label: "Success Rate",
    },
    {
      icon: <FaHeart className="text-3xl text-black" />,
      number: "24/7",
      label: "Customer Support",
    },
    {
      icon: <FaEye className="text-3xl text-black" />,
      number: "5+",
      label: "Years Experience",
    },
  ];

  const values = [
    {
      title: "Security First",
      description:
        "We prioritize the security of your personal and financial data with advanced encryption and secure payment processing.",
    },
    {
      title: "User Experience",
      description:
        "Our platform is designed with simplicity in mind, making bill management accessible to users of all technical backgrounds.",
    },
    {
      title: "Innovation",
      description:
        "We continuously evolve our platform with new features and improvements based on user feedback and technological advances.",
    },
  ];

  const ctaSection = {
    title: "Ready to Get Started?",
    description:
      "Join thousands of satisfied customers who have simplified their bill management with SmartBills.",
    buttonText: "Start Managing Bills Today",
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <section className="py-20 text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            About <span className="text-[#E5CBB8]">{companyInfo.name}</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {companyInfo.tagline} {companyInfo.description}
          </motion.p>
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
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          {[missionVision.mission, missionVision.vision].map((item, i) => (
            <div key={i} className="text-center md:text-left">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title.split(" ")[0]}{" "}
                <span className="text-[#E5CBB8]">
                  {item.title.split(" ")[1]}
                </span>
              </h2>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="py-16"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2
            className="text-3xl font-bold mb-12"
            style={{ color: "var(--text-primary)" }}
          >
            Why <span className="text-[#E5CBB8]">Choose</span> Us?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-6 text-center rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {stat.number}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-16"
        style={{ backgroundColor: "var(--bg-secondary)" }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-3xl font-bold mb-12"
            style={{ color: "var(--text-primary)" }}
          >
            Our <span className="text-[#E5CBB8]">Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                style={{ backgroundColor: "var(--card-bg)" }}
              >
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Ready to <span className="text-[#E5CBB8]">Get Started?</span>
          </h2>
          <p
            className="text-lg mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            {ctaSection.description}
          </p>
          <button className="px-8 py-3 bg-[#E5CBB8] text-black font-semibold rounded-lg hover:bg-[#d4b89e] transition duration-300 shadow-md hover:shadow-xl">
            {ctaSection.buttonText}
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
