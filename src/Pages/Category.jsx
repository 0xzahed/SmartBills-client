import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import electricity from "../assets/images/Electricity.jpg";
import gas from "../assets/images/Gas.jpg";
import water from "../assets/images/Water.jpg";
import internet from "../assets/images/Internet.jpg";

const categories = [
  {
    id: 1,
    title: "Electricity",
    desc: "Manage your monthly electricity usage and payment easily.",
    img: electricity,
  },
  {
    id: 2,
    title: "Gas",
    desc: "Track and pay your gas bills with secure online transactions.",
    img: gas,
  },
  {
    id: 3,
    title: "Water",
    desc: "Monitor your water bills and stay updated with latest usage.",
    img: water,
  },
  {
    id: 4,
    title: "Internet",
    desc: "Pay your internet bills on time and stay connected.",
    img: internet,
  },
];

const Category = () => {
  return (
    <section
      className="py-10 sm:py-12 md:py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
      id="categories"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Manage Your Bills by Category
        </motion.h2>
        <p
          className="mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base max-w-2xl mx-auto px-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Choose a category below to explore and manage your specific utility
          bills easily.
        </p>

        {/* Category Cards */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/bills?category=${cat.title}`}
                className="card block shadow-md hover:shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 group"
              >
                <div className="h-40 sm:h-44 md:h-48 w-full overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3
                    className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm mb-2 sm:mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {cat.desc}
                  </p>
                  <span
                    className="inline-block text-xs sm:text-sm font-medium group-hover:underline"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    View Bills →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
