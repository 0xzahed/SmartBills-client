import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { motion } from "framer-motion";

const MotionHeader = motion.div;
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

const SubscriptionDetails = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const memoizedState = useMemo(() => location.state || {}, [location.state]);
  const stateProvider = memoizedState.provider;
  const stateBills = memoizedState.bills;

  const [provider, setProvider] = useState(stateProvider || null);
  const [relatedBills, setRelatedBills] = useState(stateBills || []);
  const [loading, setLoading] = useState(!stateProvider);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!providerId) return;

    if (stateProvider) {
      setProvider(stateProvider);
      setRelatedBills(Array.isArray(stateBills) ? stateBills : []);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const fetchDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const [providerRes, billsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/providers/${providerId}`, {
            signal: controller.signal,
          }),
          axios.get(`${API_BASE_URL}/bills`, { signal: controller.signal }),
        ]);

        if (!isActive) return;

        const providerData =
          Array.isArray(providerRes.data) && providerRes.data.length > 0
            ? providerRes.data[0]
            : providerRes.data;

        if (!providerData || !providerData?._id) {
          setError("Provider details not found.");
          setProvider(null);
          setRelatedBills([]);
          return;
        }

        setProvider(providerData);

        const billsData = Array.isArray(billsRes.data) ? billsRes.data : [];
        const filtered = billsData.filter((bill) => {
          if (!bill) return false;
          if (bill.providerId && bill.providerId === providerId) return true;
          if (bill.providerName && providerData.name) {
            return (
              bill.providerName.toLowerCase() ===
              providerData.name.toLowerCase()
            );
          }
          if (bill.category && providerData.type) {
            return (
              bill.category.toLowerCase() === providerData.type.toLowerCase()
            );
          }
          return false;
        });
        setRelatedBills(filtered);
      } catch (err) {
        if (!isActive || controller.signal.aborted) return;
        console.error("Subscription details fetch error:", err);
        setError(
          "We could not load this subscription right now. Please try again later.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [providerId, stateProvider, stateBills]);

  const primaryBill = useMemo(() => {
    if (!Array.isArray(relatedBills)) return null;
    return relatedBills[0] || null;
  }, [relatedBills]);

  return (
    <section
      className="min-h-screen py-12 sm:py-14 md:py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <MotionHeader
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Subscription Details
          </h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-xs sm:text-sm font-medium underline"
            style={{ color: "var(--accent-primary)" }}
          >
            Back
          </button>
        </MotionHeader>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : error ? (
          <div className="text-center text-sm sm:text-base text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            {error}
          </div>
        ) : !provider ? (
          <div
            className="text-center text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            No subscription information available.
          </div>
        ) : (
          <MotionCard
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card rounded-2xl border border-gray-800/20 overflow-hidden"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            {provider.logo ? (
              <div className="h-48 sm:h-56 bg-black flex items-center justify-center">
                <img
                  src={provider.logo}
                  alt={provider.name || "Provider logo"}
                  className="h-32 sm:h-36 object-contain"
                />
              </div>
            ) : null}

            <div className="p-5 sm:p-6 md:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2
                    className="text-xl sm:text-2xl font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {provider.name || "Unnamed Provider"}
                  </h2>
                  <p className="text-xs sm:text-sm uppercase tracking-wide text-gray-400">
                    {provider.type || provider.category || "General"}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2 text-xs sm:text-sm">
                  {provider.website ? (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-md bg-[#E5CBB8] text-black font-medium hover:bg-[#d9b99f] transition"
                    >
                      Visit Website
                    </a>
                  ) : null}
                  {provider.hotline ? (
                    <span className="px-3 py-1 rounded-md bg-black text-white font-medium">
                      Hotline: {provider.hotline}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                {detailItems.map(({ key, label }) => {
                  const value = provider[key];
                  if (!value) return null;

                  return (
                    <div
                      key={key}
                      className="rounded-lg border border-gray-800/10 p-3"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {label}
                      </p>
                      <p
                        className="mt-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatValue(value)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div
                className="border border-gray-800/10 rounded-xl p-4"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <h3
                  className="text-sm sm:text-base font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Available Bills
                </h3>

                {Array.isArray(relatedBills) && relatedBills.length > 0 ? (
                  <div className="space-y-3">
                    {relatedBills.map((bill) => (
                      <div
                        key={bill._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-800/10 rounded-lg px-3 py-3"
                        style={{ backgroundColor: "var(--card-bg)" }}
                      >
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {bill.title}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            ৳{bill.amount} • {bill.location}
                          </p>
                          {bill.date ? (
                            <p
                              className="text-[11px] mt-1"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              Billing Date: {bill.date}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/bills/${bill._id}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md bg-black text-white hover:opacity-85 transition"
                          >
                            Pay Bill
                          </Link>
                          <Link
                            to={`/bills/${bill._id}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-[#E5CBB8] text-[#E5CBB8] hover:bg-[#E5CBB8] hover:text-black transition"
                          >
                            View Bill
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    No bills tied to this provider yet. New bills will appear
                    here when available.
                  </p>
                )}
              </div>

              {primaryBill ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-emerald-300">
                      Quick Pay
                    </p>
                    <p className="text-xs text-emerald-100">
                      Jump straight to your latest bill and complete payment in
                      a few steps.
                    </p>
                  </div>
                  <Link
                    to={`/bills/${primaryBill._id}`}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-emerald-500 text-black hover:bg-emerald-400 transition"
                  >
                    Pay Bill Now
                  </Link>
                </div>
              ) : null}
            </div>
          </MotionCard>
        )}
      </div>
    </section>
  );
};

export default SubscriptionDetails;
