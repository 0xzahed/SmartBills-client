import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-base-100 to-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Simplify Your{" "}
            <span className="text-[#E5CBB8]">Bill Management</span>?
          </h2>
          <p className="text-lg md:text-xl text-base-content/70 mb-8 max-w-3xl mx-auto">
            Join thousands of users who have already taken control of their
            utility bills. Start managing your bills smarter, faster, and more
            efficiently today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/auth/register"
              className="btn btn-lg bg-[#E5CBB8] hover:bg-[#D4A574] text-black border-none px-8 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Get Started Free
              <MdArrowForward className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/bills"
              className="btn btn-lg btn-outline border-2 px-8 font-semibold text-lg hover:bg-base-content hover:text-base-100 transition-all duration-300"
            >
              Explore Bills
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E5CBB8] mb-2">✓</div>
              <p className="text-base-content/70">No Credit Card Required</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E5CBB8] mb-2">✓</div>
              <p className="text-base-content/70">Free Forever Plan</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E5CBB8] mb-2">✓</div>
              <p className="text-base-content/70">24/7 Support Available</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
