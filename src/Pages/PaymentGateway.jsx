import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../config";
const MotionCard = motion.div;

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const bill = location.state?.bill;
  const provider = location.state?.provider;

  const validatePaymentForm = (form) => {
    const issues = [];
    const cardNumberRaw = form.cardNumber.value.replace(/\s+/g, "");
    const expiryRaw = form.expiryDate.value.trim();
    const cvvRaw = form.cvv.value.trim();
    const phoneRaw = form.phone.value.trim();

    if (!/^[0-9]{13,19}$/.test(cardNumberRaw)) {
      issues.push("Enter a valid card number (13-19 digits).");
    }

    const expiryMatch = expiryRaw.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
    if (!expiryMatch) {
      issues.push("Use MM/YY format for expiry date.");
    } else {
      const month = Number(expiryMatch[1]);
      const year = 2000 + Number(expiryMatch[2]);
      const expiryDate = new Date(year, month);
      const now = new Date();
      if (expiryDate <= now) {
        issues.push("This card is expired.");
      }
    }

    if (!/^[0-9]{3,4}$/.test(cvvRaw)) {
      issues.push("Enter a valid 3 or 4 digit CVV.");
    }

    if (!form.name.value.trim()) issues.push("Full name is required.");
    if (!form.email.value.trim()) issues.push("Email is required.");
    if (!form.address.value.trim()) issues.push("Billing address is required.");
    if (!phoneRaw || phoneRaw.length < 7) {
      issues.push("Enter a valid phone number.");
    }

    return { isValid: issues.length === 0, issues, cardNumberRaw };
  };

  if (!bill) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <p className="text-xl mb-4" style={{ color: "var(--text-primary)" }}>
          No bill data found
        </p>
        <button
          onClick={() => navigate("/bills")}
          className="px-6 py-2 bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition"
        >
          Go Back to Bills
        </button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const { isValid, issues, cardNumberRaw } = validatePaymentForm(form);
    if (!isValid) {
      setFormErrors(issues);
      toast.error(issues[0]);
      setLoading(false);
      return;
    }
    setFormErrors([]);
    const cardLast4 = cardNumberRaw.slice(-4);
    const paymentInfo = {
      billsId: bill._id,
      username: form.name.value,
      email: form.email.value,
      address: form.address.value,
      phone: form.phone.value,
      amount: bill.amount,
      date: new Date().toISOString().split("T")[0],
      additionalInfo: `Card: **** **** **** ${cardLast4}`,
    };

    try {
      toast.loading("Processing payment...", { id: "payment-process" });

      // Save to mybills
      await axios.post(`${API_BASE_URL}/mybills`, paymentInfo, {
        headers: {
          "x-user-email": paymentInfo.email,
        },
      });

      let emailNote = "Check your email for the invoice.";
      try {
        const receiptResponse = await axios.post(
          `${API_BASE_URL}/payments/complete`,
          {
            email: form.email.value,
            username: form.name.value,
            billId: bill._id,
            billTitle: bill.title,
            billCategory: bill.category,
            providerName: provider?.name || "N/A",
            amount: bill.amount,
            paymentMethod: "Card",
            cardLast4,
            transactionId: `TXN-${Date.now()}`,
            paymentDate: new Date().toISOString().split("T")[0],
            phone: form.phone.value,
            address: form.address.value,
          }
        );

        const emailStatus = receiptResponse.data?.emailStatus;
        if (!emailStatus?.sent) {
          emailNote =
            "Payment saved but invoice email could not be sent automatically.";
        }
        toast.success(receiptResponse.data?.message || "Payment successful.", {
          id: "payment-process",
        });
      } catch (emailError) {
        console.warn("Invoice email failed:", emailError);
        emailNote =
          "Payment saved but invoice email could not be sent automatically.";
        toast.success("Payment recorded.", {
          id: "payment-process",
        });
      }

      Swal.fire({
        title: "Payment Successful!",
        text: `Your ${bill.title} payment of ৳${bill.amount} has been processed successfully. ${emailNote}`,
        icon: "success",
        confirmButtonText: "Great!",
        confirmButtonColor: "#10b981",
      }).then(() => {
        navigate("/bills");
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment. Please try again.", {
        id: "payment-process",
      });

      Swal.fire({
        title: "Payment Failed!",
        text: "There was an error processing your payment. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium mb-4 hover:opacity-80 transition"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="mr-2">←</span> Back
          </button>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Complete Payment
          </h1>
          <p
            className="text-sm sm:text-base opacity-70 mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Secure payment gateway
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bill Summary */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h2
              className="text-xl font-semibold mb-4 pb-3 border-b"
              style={{
                color: "var(--text-primary)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              Bill Summary
            </h2>

            <div className="space-y-3">
              <div>
                <p
                  className="text-sm opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Bill Title
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {bill.title}
                </p>
              </div>

              {provider && (
                <div>
                  <p
                    className="text-sm opacity-70"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Provider
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {provider.name}
                  </p>
                </div>
              )}

              <div>
                <p
                  className="text-sm opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Category
                </p>
                <p
                  className="font-semibold capitalize"
                  style={{ color: "var(--text-primary)" }}
                >
                  {bill.category}
                </p>
              </div>

              <div>
                <p
                  className="text-sm opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Due Date
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date(bill.dueDate).toLocaleDateString()}
                </p>
              </div>

              <div
                className="pt-3 mt-3 border-t"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <p
                  className="text-sm opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Total Amount
                </p>
                <p className="text-3xl font-bold text-emerald-500 mt-1">
                  ${bill.amount}
                </p>
              </div>
            </div>
          </MotionCard>

          {/* Payment Form */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h2
              className="text-xl font-semibold mb-6 pb-3 border-b"
              style={{
                color: "var(--text-primary)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              Payment Information
            </h2>

            {formErrors.length > 0 && (
              <div className="mb-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
                <p className="font-semibold">Please fix the following:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {formErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Card Details Section */}
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Card Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderColor: "rgba(255,255,255,0.1)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        maxLength="3"
                        className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderColor: "rgba(255,255,255,0.1)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Billing Information Section */}
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Billing Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={user?.displayName || ""}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={user?.email || ""}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Billing Address
                    </label>
                    <textarea
                      name="address"
                      rows="3"
                      placeholder="Enter your billing address"
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-lg font-semibold rounded-md bg-emerald-500 text-black hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Complete Payment - ${bill.amount}
                    </>
                  )}
                </button>
                <p
                  className="text-xs text-center mt-3 opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </form>
          </MotionCard>
        </div>
      </div>
    </section>
  );
};

export default PaymentGateway;
