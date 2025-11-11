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
      className="py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
      id="categories"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Manage Your Bills by Category
        </motion.h2>
        <p
          className="mb-10 max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Choose a category below to explore and manage your specific utility
          bills easily.
        </p>

        {/* Category Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/bills?category=${cat.title}`}
                className="card block shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 group"
              >
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {cat.desc}
                  </p>
                  <span
                    className="inline-block text-sm font-medium group-hover:underline"
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
