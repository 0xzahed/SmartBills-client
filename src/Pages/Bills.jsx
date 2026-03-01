import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../Provider/AuthProvider";
import { MdSearch, MdFilterList } from "react-icons/md";
import { CardSkeleton } from "../Components/SkeletonLoader/SkeletonLoader";

const MotionHeading = motion.h2;

const Bills = () => {
  const { user } = useContext(AuthContext);

  const [subscriptions, setSubscriptions] = useState([]);
  const [providerMap, setProviderMap] = useState({});
  const [billsByType, setBillsByType] = useState({});
  const [allBills, setAllBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --------------------
  // FORMAT helper
  // --------------------
  const formatStatus = (value) => {
    if (!value) return "Subscribed";
    const text = String(value);
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const normalizeKey = (value) => {
    if (!value) return "";
    return String(value).trim().toLowerCase();
  };

  // --------------------
  // LOAD DATA
  // --------------------
  useEffect(() => {
    if (!user?.email) {
      setSubscriptions([]);
      setProviderMap({});
      setBillsByType({});
      setAllBills([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    setLoading(true);

    console.log("🔵 Bills.jsx - Starting API calls");
    console.log("📧 User email:", user?.email);
    console.log("🌐 API Base URL:", API_BASE_URL);

    Promise.all([
      axios.get(`${API_BASE_URL}/subscriptions`, { params: { email: user?.email || "" } }),
      axios.get(`${API_BASE_URL}/providers`),
      axios.get(`${API_BASE_URL}/bills`),
    ])
      .then(([subsRes, providersRes, billsRes]) => {
        if (!isMounted) return;

        console.log("✅ Bills.jsx - API responses received:");
        console.log("📦 Subscriptions response:", subsRes);
        console.log("📦 Providers response:", providersRes);
        console.log("📦 Bills response:", billsRes);

        // Extract data from API responses
        const subsData = Array.isArray(subsRes.data)
          ? subsRes.data
          : subsRes.data?.data || [];
        const providersData = Array.isArray(providersRes.data)
          ? providersRes.data
          : providersRes.data?.providers || providersRes.data?.data || [];
        const billsData = Array.isArray(billsRes.data)
          ? billsRes.data
          : billsRes.data?.bills || billsRes.data?.data || [];

        console.log("📊 Subscriptions data:", subsData);
        console.log("📊 Providers data:", providersData);
        console.log("📊 Bills data:", billsData);
        console.log("📊 Providers is array?", Array.isArray(providersData));
        console.log("📊 Bills is array?", Array.isArray(billsData));

        // provider lookup map
        const providerLookup = providersData.reduce((acc, p) => {
          acc[p._id] = p;
          return acc;
        }, {});

        // group bills by category/type
        const grouped = billsData.reduce((acc, bill) => {
          const key = normalizeKey(bill.category);
          if (!key) return acc;
          if (!acc[key]) acc[key] = [];
          acc[key].push(bill);
          return acc;
        }, {});

        // Enhance bills with provider info
        const enhancedBills = billsData.map((bill) => ({
          ...bill,
          provider: providerLookup[bill.providerId] || {},
        }));

        setSubscriptions(subsData);
        setProviderMap(providerLookup);
        setBillsByType(grouped);
        setAllBills(enhancedBills);

        console.log("✅ Bills.jsx - State updated successfully");
        console.log("📌 Total subscriptions:", subsData.length);
        console.log("📌 Total providers:", providersData.length);
        console.log("📌 Total bills:", billsData.length);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("❌ Bills.jsx - API Error:", err);
        console.error("❌ Error response:", err.response);
        console.error("❌ Error message:", err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user]);

  // --------------------
  // MERGE subscription + provider + bills
  // --------------------
  const subscriptionsWithDetails = useMemo(() => {
    if (!subscriptions.length) return [];

    return subscriptions.map((sub) => {
      const provider = providerMap[sub.providerId] || {};
      const typeLabel = sub.type || provider.type || "general";
      const normalized = normalizeKey(typeLabel);

      return {
        ...sub,
        provider,
        providerName: sub.providerName || provider.name || "Unknown Provider",
        type: typeLabel,
        normalizedType: normalized,
        bills: billsByType[normalized] || [],
        statusLabel: formatStatus(sub.status),
      };
    });
  }, [subscriptions, providerMap, billsByType]);

  // Filter, Sort, and Paginate Bills
  const filteredAndSortedBills = useMemo(() => {
    let filtered = [...allBills];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bill) =>
          bill.title?.toLowerCase().includes(term) ||
          bill.category?.toLowerCase().includes(term) ||
          bill.provider?.name?.toLowerCase().includes(term),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (bill) =>
          normalizeKey(bill.category) === selectedCategory.toLowerCase(),
      );
    }

    // Provider filter
    if (selectedProvider !== "all") {
      filtered = filtered.filter(
        (bill) => bill.providerId === selectedProvider,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
          );
        case "oldest":
          return (
            new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
          );
        case "amount-high":
          return parseFloat(b.amount || 0) - parseFloat(a.amount || 0);
        case "amount-low":
          return parseFloat(a.amount || 0) - parseFloat(b.amount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allBills, searchTerm, selectedCategory, selectedProvider, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBills.length / itemsPerPage);
  const paginatedBills = filteredAndSortedBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Get unique categories and providers
  const categories = useMemo(() => {
    const cats = new Set(allBills.map((bill) => bill.category).filter(Boolean));
    return Array.from(cats);
  }, [allBills]);

  const providers = useMemo(() => {
    return Object.values(providerMap);
  }, [providerMap]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedProvider, sortBy]);

  // --------------------
  // RENDER
  // --------------------
  return (
    <section
      className="py-10 sm:py-12 md:py-16 min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <MotionHeading
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8"
          style={{ color: "var(--text-primary)" }}
        >
          Explore & Pay Bills
        </MotionHeading>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bills by title, category, or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-base-300 bg-base-200 focus:outline-none focus:ring-2 focus:ring-[#E5CBB8]"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                <MdFilterList className="inline mr-1" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-base-300 bg-base-200 focus:outline-none focus:ring-2 focus:ring-[#E5CBB8]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={normalizeKey(cat)}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Provider Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-base-300 bg-base-200 focus:outline-none focus:ring-2 focus:ring-[#E5CBB8]"
              >
                <option value="all">All Providers</option>
                {providers.map((provider) => (
                  <option key={provider._id} value={provider._id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-base-300 bg-base-200 focus:outline-none focus:ring-2 focus:ring-[#E5CBB8]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-4 py-2 rounded-lg bg-base-200 text-center">
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {filteredAndSortedBills.length} bills found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bills Grid */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <CardSkeleton count={8} />
          </div>
        ) : paginatedBills.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: "var(--text-secondary)" }}>
              No bills found matching your criteria.
            </p>
            <Link
              to="/providers"
              className="btn btn-primary mt-4"
              style={{
                backgroundColor: "#E5CBB8",
                color: "black",
                border: "none",
              }}
            >
              Browse Providers
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedBills.map((bill) => (
                <motion.div
                  key={bill._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                >
                  <figure className="h-48">
                    <img
                      src={
                        bill.image ||
                        bill.provider?.logo ||
                        "https://via.placeholder.com/300x200"
                      }
                      alt={bill.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h3
                      className="card-title text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {bill.title || "Utility Bill"}
                    </h3>
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {bill.description ||
                        bill.category ||
                        "Pay your utility bill"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="badge badge-outline">
                        {bill.category}
                      </span>
                      <span className="text-lg font-bold text-black dark:text-white">
                        ৳{parseFloat(bill.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="card-actions mt-4">
                      <Link
                        to={`/bills/${bill._id}`}
                        state={{ bill, provider: bill.provider }}
                        className="btn btn-sm w-full"
                        style={{
                          backgroundColor: "#E5CBB8",
                          color: "black",
                          border: "none",
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="btn btn-sm"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`btn btn-sm ${currentPage === page ? "btn-active" : ""}`}
                      style={
                        currentPage === page
                          ? {
                              backgroundColor: "#E5CBB8",
                              color: "black",
                              border: "none",
                            }
                          : {}
                      }
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Subscriptions Section */}
        <div className="mt-16">
          <h3
            className="text-2xl font-bold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            My Subscribed Providers
          </h3>

          <div
            className="rounded-xl border border-gray-800/20 p-6 sm:p-7"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h4
                  className="text-lg sm:text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Stay organized with your subscribed services
                </h4>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Your subscribed providers and related bills will appear here.
                </p>
              </div>
              <Link
                to="/providers"
                className="px-3 py-1.5 text-sm font-medium rounded-md border border-[#E5CBB8] text-[#E5CBB8] hover:bg-[#E5CBB8] hover:text-black transition"
              >
                Browse Providers
              </Link>
            </div>

            {/* Loader */}
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-bars loading-md"></span>
              </div>
            ) : subscriptionsWithDetails.length === 0 ? (
              <p
                className="mt-6 text-center text-sm sm:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                You have not subscribed to any providers yet.
              </p>
            ) : (
              <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {subscriptionsWithDetails.map((sub) => {
                  const provider = sub.provider;
                  const bills = sub.bills;
                  const primaryBill = bills[0];
                  const extraCount = bills.length - 1;

                  const subscriptionDate = sub.subscribedAt
                    ? new Date(sub.subscribedAt).toLocaleDateString()
                    : "Recently";

                  // SELECT Detail Button
                  let detailButton = null;

                  if (primaryBill) {
                    detailButton = (
                      <Link
                        to={`/bills/${primaryBill._id}`}
                        state={{ bill: primaryBill, provider: provider }}
                        className="px-3 py-1.5 text-xs rounded-md bg-[#E5CBB8] text-black hover:bg-[#d9b99f] transition"
                      >
                        View Bill Details
                      </Link>
                    );
                  } else if (provider?.website) {
                    detailButton = (
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs rounded-md bg-[#E5CBB8] text-black hover:bg-[#d9b99f] transition"
                      >
                        Visit Provider
                      </a>
                    );
                  } else {
                    detailButton = (
                      <Link
                        to="/providers"
                        className="px-3 py-1.5 text-xs rounded-md bg-[#E5CBB8] text-black hover:bg-[#d9b99f] transition"
                      >
                        View Provider
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={sub._id}
                      className="rounded-lg border border-gray-700/20 px-5 py-4"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      {/* Provider header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p
                            className="text-base font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {sub.providerName}
                          </p>
                          <p className="text-xs uppercase text-gray-500 mt-1">
                            {sub.type}
                          </p>
                        </div>

                        {provider?.logo && (
                          <img
                            src={provider.logo}
                            alt={sub.providerName}
                            className="w-12 h-12 rounded object-cover hidden sm:block"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div
                        className="mt-4 space-y-2 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <p>
                          Subscription Status:{" "}
                          <span className="font-semibold text-emerald-400">
                            {sub.statusLabel}
                          </span>
                        </p>
                        <p>Subscribed on {subscriptionDate}</p>
                      </div>

                      {/* Buttons */}
                      <div className="mt-4">
                        {detailButton}

                        {extraCount > 0 && (
                          <p
                            className="text-[11px] mt-2"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {extraCount} more available bill
                            {extraCount > 1 ? "s" : ""}.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bills;
