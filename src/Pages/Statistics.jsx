import React from "react";
import { motion } from "framer-motion";
import { MdPeople, MdPayment, MdTrendingUp, MdStars } from "react-icons/md";

const Statistics = () => {
  const stats = [
    {
      icon: <MdPeople className="w-12 h-12" />,
      value: "10,000+",
      label: "Active Users",
      color: "text-blue-500",
    },
    {
      icon: <MdPayment className="w-12 h-12" />,
      value: "৳50M+",
      label: "Bills Processed",
      color: "text-green-500",
    },
    {
      icon: <MdTrendingUp className="w-12 h-12" />,
      value: "99.9%",
      label: "Success Rate",
      color: "text-purple-500",
    },
    {
      icon: <MdStars className="w-12 h-12" />,
      value: "4.9/5",
      label: "User Rating",
      color: "text-orange-500",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#E5CBB8]/10 to-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Trusted by <span className="text-[#E5CBB8]">Thousands</span>
          </h2>
          <p className="text-lg text-base-content/70">
            Join our growing community of satisfied users
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="card-body items-center text-center">
                <div className={stat.color}>{stat.icon}</div>
                <h3 className="text-4xl font-bold mt-4">{stat.value}</h3>
                <p className="text-base-content/70 text-lg">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
