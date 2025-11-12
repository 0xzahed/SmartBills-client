import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";

const BillDetails = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`https://smart-bills-server.vercel.app/bills/${id}`)
      .then((res) => {
        setBill(res.data);
      });
  }, [id]);

  if (!bill)
    return (
      <p className="text-center mt-10">
        <span className="loading loading-bars loading-lg"></span>
      </p>
    );

  const billMonth = new Date(bill.date).getMonth();
  const currentMonth = new Date().getMonth();
  const isPayable = billMonth === currentMonth;
  const handlePayBill = async (e) => {
    e.preventDefault();

    const form = e.target;
    const paymentInfo = {
      billsId: bill._id,
      username: form.username.value,
      email: user?.email,
      address: form.address.value,
      phone: form.phone.value,
      amount: bill.amount,
      date: new Date().toISOString().split("T")[0],
      additionalInfo: form.info.value,
    };

    try {
      toast.loading("Processing payment...", { id: "payment-process" });
      await axios.post(
        "https://smart-bills-server.vercel.app/mybills",
        paymentInfo
      );

      toast.success("Bill payment successful!", { id: "payment-process" });
      setShowModal(false);

      Swal.fire({
        title: "Payment Successful!",
        text: `Your ${bill.title} payment of $${bill.amount} has been processed successfully.`,
        icon: "success",
        confirmButtonText: "Great!",
        confirmButtonColor: "#10b981",
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
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-8 md:mt-10 p-4 sm:p-5 md:p-6 bg-white rounded-xl shadow-lg">
      <img
        src={bill.image}
        alt={bill.title}
        className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-md"
      />
      <h2 className="text-xl sm:text-2xl font-bold mt-3 sm:mt-4">
        {bill.title}
      </h2>
      <p className="text-sm sm:text-base text-gray-600">
        Category: {bill.category}
      </p>
      <p className="text-sm sm:text-base text-gray-600">
        Location: {bill.location}
      </p>
      <p className="text-sm sm:text-base text-gray-700 mt-2">
        {bill.description}
      </p>
      <p className="text-base sm:text-lg font-semibold mt-2 sm:mt-3 text-gray-900">
        Amount: ৳{bill.amount}
      </p>
      <p className="text-sm sm:text-base text-gray-500">Date: {bill.date}</p>

      <div className="mt-4 sm:mt-5 md:mt-6">
        <button
          onClick={() => setShowModal(true)}
          disabled={!isPayable}
          className={`px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg text-white font-medium transition duration-300 ${
            isPayable
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isPayable ? "Pay Bill" : "Only current month bills can be paid"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-5 md:p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl sm:text-2xl"
            >
              ✕
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
              Pay Bill
            </h2>

            <form onSubmit={handlePayBill} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full border p-2 text-sm sm:text-base rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700">
                  Bill ID
                </label>
                <input
                  type="text"
                  value={bill._id}
                  readOnly
                  className="w-full border p-2 text-sm sm:text-base rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700">
                  Amount
                </label>
                <input
                  type="text"
                  value={bill.amount}
                  readOnly
                  className="w-full border p-2 text-sm sm:text-base rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter your name"
                  className="w-full border p-2 text-sm sm:text-base rounded"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Enter your address"
                  className="w-full border p-2 text-sm sm:text-base rounded"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="Enter your phone number"
                  className="w-full border p-2 text-sm sm:text-base rounded"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700">
                  Date
                </label>
                <input
                  type="text"
                  value={new Date().toISOString().split("T")[0]}
                  readOnly
                  className="w-full border p-2 text-sm sm:text-base rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700">
                  Additional Info
                </label>
                <textarea
                  name="info"
                  placeholder="(Optional)"
                  className="w-full border p-2 text-sm sm:text-base rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 text-sm sm:text-base rounded font-medium transition"
              >
                Confirm Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
