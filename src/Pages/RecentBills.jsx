import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const RecentBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://smart-bills-server.vercel.app/bills/recent")
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
      <div
        className="text-center py-12 sm:py-16 md:py-20 font-semibold text-sm sm:text-base md:text-lg"
        style={{ color: "var(--text-secondary)" }}
      >
        Loading recent bills...
      </div>
    );
  }

  return (
    <section
      className="py-8 sm:py-12 md:py-14 lg:py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
      id="recent-bills"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Recent Bills
        </motion.h2>
        <p
          className="mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4"
          style={{ color: "var(--text-secondary)" }}
        >
          View the most recent utility bills added to our system.
        </p>

        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bills.map((bill, index) => (
            <motion.div
              key={bill._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <img
                src={bill.image}
                alt={bill.title}
                className="w-full h-40 sm:h-44 md:h-48 lg:h-52 object-cover"
              />
              <div className="p-4 sm:p-5 text-left">
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {bill.title}
                </h3>
                <p
                  className="text-xs sm:text-sm md:text-base mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="font-medium">Category:</span> {bill.category}
                </p>
                <p
                  className="text-xs sm:text-sm md:text-base mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="font-medium">Location:</span> {bill.location}
                </p>
                <p
                  className="text-xs sm:text-sm md:text-base mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(bill.date).toLocaleDateString()}
                </p>
                <Link
                  to={`/bills/${bill._id}`}
                  className="btn-primary inline-block text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6 py-2 rounded-md hover:opacity-90 transition-all duration-300"
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
