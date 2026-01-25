import { useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { API_BASE_URL } from "../config/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AuthContext } from "../Provider/AuthProvider";

const timeframeOptions = [
  { label: "30 Days", value: "30" },
  { label: "90 Days", value: "90" },
  { label: "1 Year", value: "365" },
  { label: "All Time", value: "all" },
];

const formatAmount = (value) => {
  const amountNumber = Number(value) || 0;
  return `৳${amountNumber.toLocaleString()}`;
};

const formatDate = (value) => {
  if (!value) return "Not available";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Not available";
  return parsed.toLocaleDateString();
};

const InsightCard = ({ title, value, subtext, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card rounded-xl shadow-md p-4 sm:p-6 border border-gray-800/20"
    style={{ backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }}
  >
    <p className="text-sm font-medium" style={{ color: accent }}>
      {title}
    </p>
    <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
    {subtext ? (
      <p
        className="text-xs sm:text-sm mt-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {subtext}
      </p>
    ) : null}
  </motion.div>
);

const Insights = () => {
  const { user } = useContext(AuthContext);
  const [timeframe, setTimeframe] = useState("90");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bills, setBills] = useState([]);
  const [serverSummary, setServerSummary] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const controller = new AbortController();
    let isMounted = true;

    const fetchInsights = async () => {
      setLoading(true);
      setError("");
      toast.loading("Loading insights...", { id: "insights-loader" });

      console.log("🔵 Insights.jsx - Starting API calls");
      console.log("📧 User email:", user.email);
      console.log("🌐 API Base URL:", API_BASE_URL);
      console.log("⏱️ Timeframe:", timeframe);

      try {
        const [billsResponse, insightsResponse] = await Promise.all([
          axiosInstance.get(`${API_BASE_URL}/mybills?email=${user.email}`),
          axiosInstance.post(`${API_BASE_URL}/ai/insights`, {
            email: user.email,
            timeframe,
          }),
        ]);

        console.log("✅ Insights - Bills Response:", billsResponse);
        console.log("✅ Insights - AI Response:", insightsResponse);

        if (!isMounted) return;

        const billsData = billsResponse.data?.bills || billsResponse.data;
        setBills(Array.isArray(billsData) ? billsData : []);
        setServerSummary(insightsResponse.data || null);
        toast.success("Insights updated.", { id: "insights-loader" });
      } catch (err) {
        if (!isMounted || controller.signal.aborted) return;
        console.error("❌ Insights fetch error:", err);
        console.error("❌ Error response:", err.response);
        console.error("❌ Error status:", err.response?.status);
        console.error("❌ Error data:", err.response?.data);
        console.error("❌ Error config:", err.config);
        setError("Unable to load insights right now. Please try again later.");
        toast.error("Failed to load insights.", { id: "insights-loader" });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInsights();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user, timeframe]);

  const filteredBills = useMemo(() => {
    if (!Array.isArray(bills) || bills.length === 0) return [];
    if (timeframe === "all") return bills;

    const days = Number(timeframe);
    if (!Number.isFinite(days)) return bills;

    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - days);

    return bills.filter((bill) => {
      const billDate = bill.date ? new Date(bill.date) : null;
      if (!billDate || Number.isNaN(billDate.getTime())) return true;
      return billDate >= cutoff;
    });
  }, [bills, timeframe]);

  const derivedMetrics = useMemo(() => {
    if (filteredBills.length === 0) {
      return {
        total: 0,
        count: 0,
        average: 0,
        highest: 0,
        lastPaid: null,
        topBills: [],
      };
    }

    let runningTotal = 0;
    let highestAmount = 0;
    let lastPaymentDate = null;

    filteredBills.forEach((bill) => {
      const amount = Number(bill.amount) || 0;
      runningTotal += amount;
      if (amount > highestAmount) {
        highestAmount = amount;
      }

      const paymentDate = bill.date ? new Date(bill.date) : null;
      if (paymentDate && !Number.isNaN(paymentDate.getTime())) {
        if (!lastPaymentDate || paymentDate > lastPaymentDate) {
          lastPaymentDate = paymentDate;
        }
      }
    });

    const average = runningTotal / filteredBills.length || 0;
    const topBills = [...filteredBills]
      .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
      .slice(0, 5);

    return {
      total: runningTotal,
      count: filteredBills.length,
      average,
      highest: highestAmount,
      lastPaid: lastPaymentDate,
      topBills,
    };
  }, [filteredBills]);

  const recentBills = useMemo(() => {
    return [...filteredBills]
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [filteredBills]);

  return (
    <section
      className="min-h-screen py-12 sm:py-14 md:py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Spending Insights
          </h1>
          <p
            className="mt-3 text-sm sm:text-base md:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Track your payment habits, spot trends, and get AI-ready summaries
            tailored to your bills.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10">
          {timeframeOptions.map((option) => {
            const isActive = timeframe === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTimeframe(option.value)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium border transition-all ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-black dark:text-white border-gray-400 hover:bg-black/10"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {error ? (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400 rounded-lg p-4 text-center">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <InsightCard
                title="Total Spent"
                value={formatAmount(
                  serverSummary?.summary?.totalSpent ?? derivedMetrics.total,
                )}
                subtext={`Across ${
                  serverSummary?.summary?.billCount ?? derivedMetrics.count
                } payments`}
                accent="#2563eb"
              />
              <InsightCard
                title="Bills Paid"
                value={derivedMetrics.count}
                subtext="Filtered by selected timeframe"
                accent="#7c3aed"
              />
              <InsightCard
                title="Average Bill"
                value={formatAmount(derivedMetrics.average)}
                subtext="Mean amount per payment"
                accent="#0faf87"
              />
              <InsightCard
                title="Highest Bill"
                value={formatAmount(derivedMetrics.highest)}
                subtext={`Last paid ${formatDate(derivedMetrics.lastPaid)}`}
                accent="#f97316"
              />
            </div>

            <div className="grid gap-6 md:gap-8 mt-8 md:mt-10 grid-cols-1 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="card rounded-xl shadow-md border border-gray-800/20 p-5 sm:p-6"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-primary)",
                }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                  Recent Payments
                </h2>
                {recentBills.length === 0 ? (
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    No bill payments found for the selected timeframe.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {recentBills.map((bill) => (
                      <li
                        key={bill._id}
                        className="flex items-center justify-between rounded-lg border border-gray-800/10 px-3 py-2"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {bill.username || "Unknown payer"}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Paid on {formatDate(bill.date)}
                          </p>
                        </div>
                        <span className="text-sm font-bold">
                          {formatAmount(bill.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="card rounded-xl shadow-md border border-gray-800/20 p-5 sm:p-6"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-primary)",
                }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                  AI Summary
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {serverSummary?.ai ||
                    "AI analysis will appear here once connected to the insights service."}
                </p>

                <div className="mt-5 border-t border-gray-800/10 pt-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Coming Soon
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    You will be able to ask follow-up questions like "How much
                    did I spend on internet last quarter?" once the AI assistant
                    is enabled.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="card rounded-xl shadow-md border border-gray-800/20 p-5 sm:p-6 mt-8 md:mt-10"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-primary)",
              }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                Top Bills
              </h2>
              {derivedMetrics.topBills.length === 0 ? (
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No notable bills to display for this timeframe yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr style={{ color: "var(--text-secondary)" }}>
                        <th className="py-2 pr-2 font-medium">#</th>
                        <th className="py-2 pr-2 font-medium">Name</th>
                        <th className="py-2 pr-2 font-medium">Amount</th>
                        <th className="py-2 pr-2 font-medium">Paid On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {derivedMetrics.topBills.map((bill, index) => (
                        <tr
                          key={bill._id}
                          className="border-t border-gray-800/10"
                        >
                          <td className="py-2 pr-2">{index + 1}</td>
                          <td className="py-2 pr-2">
                            {bill.username || "Unknown"}
                          </td>
                          <td className="py-2 pr-2 font-semibold">
                            {formatAmount(bill.amount)}
                          </td>
                          <td className="py-2 pr-2">{formatDate(bill.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default Insights;
