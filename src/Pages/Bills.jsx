import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const url =
      selectedCategory === "All"
        ? "https://smart-bills-server.vercel.app/bills"
        : `https://smart-bills-server.vercel.app/bills?category=${selectedCategory}`;
    setLoading(true);

    axios
      .get(url)
      .then((res) => {
        setBills(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bills:", error);
        setLoading(false);
      });
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20 text-gray-600 font-semibold">
        <span className="loading loading-bars loading-lg sm:loading-xl"></span>
      </div>
    );
  }

  return (
    <section
      className="py-10 sm:py-12 md:py-16 min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          All Utility Bills
        </motion.h2>

        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Gas">Gas</option>
            <option value="Water">Water</option>
            <option value="Internet">Internet</option>
          </select>
        </div>

        {bills.length === 0 ? (
          <p
            className="text-center text-sm sm:text-base font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            No bills found for this category.
          </p>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {bills.map((bill, index) => (
              <motion.div
                key={bill._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300"
              >
                <img
                  src={bill.image}
                  alt={bill.title}
                  className="w-full h-40 sm:h-44 md:h-48 object-cover"
                />
                <div className="p-4 sm:p-5 text-left">
                  <h3
                    className="text-lg sm:text-xl font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {bill.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="font-medium">Category:</span>{" "}
                    {bill.category}
                  </p>
                  <p
                    className="text-xs sm:text-sm mb-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="font-medium">Location:</span>{" "}
                    {bill.location}
                  </p>
                  <p
                    className="text-xs sm:text-sm mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="font-medium">Amount:</span> ৳{bill.amount}
                  </p>

                  <Link
                    to={`/bills/${bill._id}`}
                    className="btn-primary inline-block text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-md hover:opacity-90 transition-all duration-300"
                  >
                    See Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Bills;
