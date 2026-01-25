import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card bg-gradient-to-r from-[#E5CBB8] to-[#D4A574] shadow-2xl"
        >
          <div className="card-body text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-full">
                <MdEmail className="w-12 h-12 text-[#E5CBB8]" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Stay Updated with SmartBills
            </h2>
            <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest updates, tips for
              managing bills, and exclusive offers delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn bg-black hover:bg-gray-800 text-white border-none px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
              <p className="text-black/70 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
