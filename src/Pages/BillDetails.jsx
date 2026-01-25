import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import {
  MdHome,
  MdChevronRight,
  MdPayment,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdInfo,
  MdReceipt,
} from "react-icons/md";
import { DetailsSkeleton } from "../Components/SkeletonLoader/SkeletonLoader";

const BillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [provider, setProvider] = useState(null);
  const [relatedBills, setRelatedBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [billRes, providersRes, allBillsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/bills/${id}`, {
            signal: controller.signal,
          }),
          axios.get(`${API_BASE_URL}/providers`, { signal: controller.signal }),
          axios.get(`${API_BASE_URL}/bills`, { signal: controller.signal }),
        ]);

        if (!isMounted) return;

        const billData = billRes.data;
        setBill(billData);

        const providers = Array.isArray(providersRes.data)
          ? providersRes.data
          : [];
        const matchedProvider = providers.find(
          (p) => p.type?.toLowerCase() === billData.category?.toLowerCase(),
        );

        if (matchedProvider) {
          setProvider(matchedProvider);
        }

        // Get related bills (same category, different ID)
        const allBills = Array.isArray(allBillsRes.data)
          ? allBillsRes.data
          : [];
        const related = allBills
          .filter(
            (b) =>
              b.category?.toLowerCase() === billData.category?.toLowerCase() &&
              b._id !== billData._id,
          )
          .slice(0, 4);
        setRelatedBills(related);
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

  if (loading) return <DetailsSkeleton />;

  if (!bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bill Not Found</h2>
          <Link to="/bills" className="btn btn-primary">
            Back to Bills
          </Link>
        </div>
      </div>
    );
  }

  const handlePayNow = () => {
    navigate(`/payment/${bill._id}`, {
      state: { bill, provider },
    });
  };

  return (
    <section className="min-h-screen py-12 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-[#E5CBB8] transition"
          >
            <MdHome className="w-4 h-4" />
            Home
          </Link>
          <MdChevronRight className="w-4 h-4 text-base-content/50" />
          <Link to="/bills" className="hover:text-[#E5CBB8] transition">
            Bills
          </Link>
          <MdChevronRight className="w-4 h-4 text-base-content/50" />
          <span className="text-base-content/70">
            {bill.title || "Bill Details"}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card bg-base-200 shadow-xl"
            >
              <figure className="h-96">
                <img
                  src={
                    bill.image ||
                    provider?.logo ||
                    "https://via.placeholder.com/800x400"
                  }
                  alt={bill.title}
                  className="w-full h-full object-cover"
                />
              </figure>
            </motion.div>

            {/* Overview Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card bg-base-200 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl flex items-center gap-2">
                  <MdInfo className="w-6 h-6 text-[#E5CBB8]" />
                  Overview
                </h2>
                <div className="divider my-2"></div>
                <p className="text-base-content/80 leading-relaxed">
                  {bill.description ||
                    `This is a ${bill.category} bill from ${provider?.name || "the provider"}. Pay your bill securely and receive instant confirmation.`}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-base-content/60">Category</p>
                    <p className="font-semibold">{bill.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Amount</p>
                    <p className="font-semibold text-2xl text-[#E5CBB8]">
                      ৳{parseFloat(bill.amount || 0).toFixed(2)}
                    </p>
                  </div>
                  {bill.dueDate && (
                    <div>
                      <p className="text-sm text-base-content/60">Due Date</p>
                      <p className="font-semibold">
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-base-content/60">Billing Type</p>
                    <p className="font-semibold">
                      {bill.billingType || "Monthly"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card bg-base-200 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl flex items-center gap-2">
                  <MdReceipt className="w-6 h-6 text-[#E5CBB8]" />
                  Payment Information
                </h2>
                <div className="divider my-2"></div>
                <div className="space-y-4">
                  {bill.paymentMethod && (
                    <div>
                      <p className="text-sm text-base-content/60">
                        Accepted Payment Methods
                      </p>
                      <p className="font-semibold">{bill.paymentMethod}</p>
                    </div>
                  )}
                  {bill.lateFeePolicy && (
                    <div className="alert alert-warning">
                      <MdInfo className="w-5 h-5" />
                      <span className="text-sm">{bill.lateFeePolicy}</span>
                    </div>
                  )}
                  {bill.zone && (
                    <div>
                      <p className="text-sm text-base-content/60">
                        Service Zone
                      </p>
                      <p className="font-semibold">{bill.zone}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Provider Details Section */}
            {provider && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card bg-base-200 shadow-xl"
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl">Provider Details</h2>
                  <div className="divider my-2"></div>
                  <div className="flex items-start gap-4">
                    {provider.logo && (
                      <img
                        src={provider.logo}
                        alt={provider.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {provider.name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        {provider.hotline && (
                          <p className="flex items-center gap-2">
                            <MdPhone className="w-4 h-4 text-[#E5CBB8]" />
                            {provider.hotline}
                          </p>
                        )}
                        {provider.supportEmail && (
                          <p className="flex items-center gap-2">
                            <MdEmail className="w-4 h-4 text-[#E5CBB8]" />
                            {provider.supportEmail}
                          </p>
                        )}
                        {provider.address && (
                          <p className="flex items-center gap-2">
                            <MdLocationOn className="w-4 h-4 text-[#E5CBB8]" />
                            {provider.address}
                          </p>
                        )}
                      </div>
                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline mt-4"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card bg-gradient-to-br from-[#E5CBB8] to-[#D4A574] text-black shadow-xl sticky top-24"
            >
              <div className="card-body">
                <h3 className="card-title text-2xl">Bill Summary</h3>
                <div className="divider my-2 bg-black/20"></div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Bill Amount:</span>
                    <span className="text-2xl font-bold">
                      ৳{parseFloat(bill.amount || 0).toFixed(2)}
                    </span>
                  </div>
                  {bill.dueDate && (
                    <div className="flex justify-between items-center text-sm">
                      <span>Due Date:</span>
                      <span className="font-semibold">
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePayNow}
                  className="btn btn-lg w-full bg-black hover:bg-gray-800 text-white border-none mt-4"
                >
                  <MdPayment className="w-6 h-6" />
                  Pay Now
                </button>
                <p className="text-xs text-center text-black/70 mt-2">
                  Secure payment processing with instant confirmation
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Bills Section */}
        {relatedBills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold mb-6">Related Bills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBills.map((relatedBill) => (
                <Link
                  key={relatedBill._id}
                  to={`/bills/${relatedBill._id}`}
                  className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <figure className="h-48">
                    <img
                      src={
                        relatedBill.image ||
                        "https://via.placeholder.com/300x200"
                      }
                      alt={relatedBill.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-base">
                      {relatedBill.title}
                    </h3>
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {relatedBill.category}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="badge badge-outline text-xs">
                        {relatedBill.category}
                      </span>
                      <span className="font-bold text-[#E5CBB8]">
                        ৳{parseFloat(relatedBill.amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BillDetails;
