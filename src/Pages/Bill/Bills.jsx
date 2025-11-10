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
        ? "http://localhost:3000/bills"
        : `http://localhost:3000/bills?category=${selectedCategory}`;
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
      <div className="text-center py-20 text-gray-600 font-semibold">
        Loading bills...
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
       
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10"
        >
          All Utility Bills
        </motion.h2>

     
        <div className="flex justify-center mb-10">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Gas">Gas</option>
            <option value="Water">Water</option>
            <option value="Internet">Internet</option>
          </select>
        </div>

       
        {bills.length === 0 ? (
          <p className="text-center text-gray-600 font-medium">
            No bills found for this category.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bills.map((bill, index) => (
              <motion.div
                key={bill._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300"
              >
                <img
                  src={bill.image}
                  alt={bill.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 text-left">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {bill.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Category:</span>{" "}
                    {bill.category}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Location:</span>{" "}
                    {bill.location}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Amount:</span> ৳{bill.amount}
                  </p>

                  <Link
                    to={`/bills/${bill._id}`}
                    className="inline-block bg-black text-white text-sm px-5 py-2 rounded-md hover:bg-gray-800 transition-all duration-300"
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
