import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config";
const MotionCard = motion.div;

const detailItems = [
  { key: "description", label: "Overview" },
  { key: "billingType", label: "Billing Type" },
  { key: "paymentMethod", label: "Payment Methods" },
  { key: "zone", label: "Service Zone" },
  { key: "lateFeePolicy", label: "Late Fee Policy" },
  { key: "hotline", label: "Hotline" },
  { key: "supportEmail", label: "Support Email" },
  { key: "address", label: "Address" },
];

const formatValue = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/_/g, " ");
};

const BillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      try {
        const billRes = await axios.get(`${API_BASE_URL}/bills/${id}`, {
          signal: controller.signal,
        });

        if (!isMounted) return;

        const billData = billRes.data;
        setBill(billData);

        if (billData?.category) {
          const providersRes = await axios.get(`${API_BASE_URL}/providers`, {
            signal: controller.signal,
          });

          if (!isMounted) return;

          const providers = Array.isArray(providersRes.data)
            ? providersRes.data
            : [];
          const matchedProvider = providers.find(
            (p) => p.type?.toLowerCase() === billData.category?.toLowerCase()
          );

          if (matchedProvider) {
            setProvider(matchedProvider);
          }
        }
      } catch (error) {
        if (!isMounted || controller.signal.aborted) return;
        console.error("Bill details fetch error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  if (loading || !bill)
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  const handlePayNow = () => {
    navigate(`/payment/${bill._id}`, {
      state: { bill, provider },
    });
  };

  return (
    <section
      className="min-h-screen py-12 sm:py-14 md:py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <MotionCard
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card rounded-2xl border border-gray-800/20 overflow-hidden"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <img
            src={bill.image}
            alt={bill.title}
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
          />

          <div className="p-5 sm:p-6 md:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-xl sm:text-2xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {bill.title}
                </h2>
                <p className="text-xs sm:text-sm uppercase tracking-wide text-gray-400 mt-1">
                  {bill.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Amount</p>
                <p className="text-2xl font-bold text-emerald-500">
                  ৳{bill.amount}
                </p>
              </div>
            </div>

            {provider ? (
              <div
                className="border border-gray-800/10 rounded-xl p-4"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3
                      className="text-base sm:text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Provider Information
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {provider.name || "Unknown Provider"}
                    </p>
                  </div>
                  {provider.logo ? (
                    <img
                      src={provider.logo}
                      alt={provider.name || "Provider logo"}
                      className="h-16 w-16 object-contain rounded-md"
                    />
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  {detailItems.map(({ key, label }) => {
                    const value = provider[key];
                    if (!value) return null;

                    return (
                      <div key={key}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          {label}
                        </p>
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {formatValue(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {provider.website ? (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 px-3 py-1.5 text-xs rounded-md bg-[#E5CBB8] text-black font-medium hover:bg-[#d9b99f] transition"
                  >
                    Visit Provider Website
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-300">
                  Ready to Pay?
                </p>
                <p className="text-xs text-emerald-100">
                  Complete your payment in a few simple steps.
                </p>
              </div>
              <button
                onClick={handlePayNow}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-emerald-500 text-black hover:bg-emerald-400 transition"
              >
                Pay Bill Now
              </button>
            </div>
          </div>
        </MotionCard>
      </div>
    </section>
  );
};

export default BillDetails;
