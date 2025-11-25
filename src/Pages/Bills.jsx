import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../Provider/AuthProvider";
import { API_BASE_URL } from "../config";

const MotionHeading = motion.h2;

const Bills = () => {
  const { user } = useContext(AuthContext);

  const [subscriptions, setSubscriptions] = useState([]);
  const [providerMap, setProviderMap] = useState({});
  const [billsByType, setBillsByType] = useState({});
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    setLoading(true);

    Promise.all([
      axios.get(`${API_BASE_URL}/subscriptions`, {
        params: { email: user.email },
        signal: controller.signal,
      }),
      axios.get(`${API_BASE_URL}/providers`, { signal: controller.signal }),
      axios.get(`${API_BASE_URL}/bills`, { signal: controller.signal }),
    ])
      .then(([subsRes, providersRes, billsRes]) => {
        if (!isMounted) return;

        const subsData = subsRes.data || [];
        const providersData = providersRes.data || [];
        const billsData = billsRes.data || [];

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

        setSubscriptions(subsData);
        setProviderMap(providerLookup);
        setBillsByType(grouped);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Load error:", err);
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

  // --------------------
  // RENDER
  // --------------------
  return (
    <section
      className="py-10 sm:py-12 md:py-16 min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <MotionHeading
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8"
          style={{ color: "var(--text-primary)" }}
        >
          My Provider Subscriptions
        </MotionHeading>

        {/* Card */}
        <div
          className="rounded-xl border border-gray-800/20 p-6 sm:p-7"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Stay organized with your subscribed services
              </h3>
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
            <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2">
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
    </section>
  );
};

export default Bills;
