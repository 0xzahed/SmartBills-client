import React from "react";
import { motion } from "framer-motion";
import {
  MdAutoGraph,
  MdNotifications,
  MdSecurity,
  MdSmartphone,
  MdBolt,
  MdCloudDone,
} from "react-icons/md";

const Features = () => {
  const features = [
    {
      icon: <MdAutoGraph className="w-12 h-12" />,
      title: "AI-Powered Insights",
      description:
        "Get intelligent spending analytics and personalized recommendations to optimize your utility expenses.",
      color: "bg-blue-500",
    },
    {
      icon: <MdNotifications className="w-12 h-12" />,
      title: "Smart Reminders",
      description:
        "Never miss a payment with automated reminders and due date notifications.",
      color: "bg-green-500",
    },
    {
      icon: <MdSecurity className="w-12 h-12" />,
      title: "Secure Payments",
      description:
        "Bank-level encryption ensures your payment information is always protected.",
      color: "bg-purple-500",
    },
    {
      icon: <MdSmartphone className="w-12 h-12" />,
      title: "Mobile Friendly",
      description:
        "Access your bills anytime, anywhere from any device with our responsive design.",
      color: "bg-orange-500",
    },
    {
      icon: <MdBolt className="w-12 h-12" />,
      title: "Instant Processing",
      description:
        "Lightning-fast payment processing with immediate confirmation and receipts.",
      color: "bg-yellow-500",
    },
    {
      icon: <MdCloudDone className="w-12 h-12" />,
      title: "Cloud Storage",
      description:
        "All your bill records safely stored in the cloud, accessible anytime you need them.",
      color: "bg-teal-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="text-[#E5CBB8]">Smarter</span> Bill Management
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Everything you need to manage, track, and pay your utility bills
            efficiently
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="card-body items-center text-center">
                <div
                  className={`p-4 rounded-full ${feature.color} text-white mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="card-title text-xl mb-2">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
