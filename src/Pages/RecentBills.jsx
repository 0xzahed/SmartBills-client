import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const RecentBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/bills?limit=6")
      .then((res) => {
        setBills(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bills:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 font-semibold">
        Loading recent bills...
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" id="recent-bills">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
        >
          Recent Bills
        </motion.h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          View the most recent utility bills added to our system.
        </p>

        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bills.map((bill, index) => (
            <motion.div
              key={bill._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
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
                  <span className="font-medium">Category:</span> {bill.category}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Location:</span> {bill.location}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(bill.date).toLocaleDateString()}
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
      </div>
    </section>
  );
};

export default RecentBills;
