import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyBills = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.email) {
      toast.loading("Loading your bills...", { id: "fetch-bills" });
      axios
        .get(
          `https://smart-bills-server.vercel.app/mybills?email=${user.email}`
        )
        .then((res) => {
          setBills(res.data);
          toast.success(`${res.data.length} bills loaded successfully!`, {
            id: "fetch-bills",
          });
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error("Failed to load bills. Please try again later.", {
            id: "fetch-bills",
          });
        });
    }
  }, [user]);

  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, b) => sum + parseFloat(b.amount), 0);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to recover this bill!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.loading("Deleting bill...", { id: "delete-bill" });
        axios
          .delete(`https://smart-bills-server.vercel.app/mybills/${id}`)
          .then(() => {
            setBills((prev) => prev.filter((b) => b._id !== id));
            toast.success("Bill deleted successfully!", { id: "delete-bill" });
            Swal.fire({
              title: "Deleted!",
              text: "Your bill has been deleted.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            console.error("Delete error:", error);
            toast.error("Failed to delete bill.", { id: "delete-bill" });
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the bill.",
              icon: "error",
            });
          });
      }
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedBill = {
      username: form.username.value,
      address: form.address.value,
      phone: form.phone.value,
      amount: form.amount.value,
      date: form.date.value,
    };

    toast.loading("Updating bill...", { id: "update-bill" });
    axios
      .put(
        `https://smart-bills-server.vercel.app/mybills/${selectedBill._id}`,
        updatedBill
      )
      .then(() => {
        setBills((prev) =>
          prev.map((b) =>
            b._id === selectedBill._id ? { ...b, ...updatedBill } : b
          )
        );
        setShowModal(false);
        toast.success("Bill updated successfully!", { id: "update-bill" });
        Swal.fire({
          title: "Updated!",
          text: "Bill has been updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.error("Update error:", error);
        toast.error("Failed to update bill.", { id: "update-bill" });
        Swal.fire({
          title: "Error!",
          text: "Failed to update the bill.",
          icon: "error",
        });
      });
  };

  const handleDownloadReport = () => {
    try {
      if (!bills || bills.length === 0) {
        toast.error("No bills found to generate report!");
        Swal.fire({
          title: "No Bills Found!",
          text: "You need to have paid bills to generate a report.",
          icon: "info",
          confirmButtonText: "OK",
        });
        return;
      }

      toast.loading("Generating PDF report...", { id: "pdf-download" });

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Utility Bill Management System", 14, 15);
      doc.setFontSize(12);
      doc.text(`My Paid Bills Report`, 14, 25);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
      doc.text(`User: ${user?.displayName || "Unknown User"}`, 14, 39);

      doc.text(`Total Bills: ${bills.length}`, 14, 46);
      doc.text(`Total Amount: ৳${totalAmount}`, 100, 46);

      const tableData = bills.map((b, i) => [
        i + 1,
        b.username || "N/A",
        b.email || user?.email || "N/A",
        b.amount || "0",
        b.address || "N/A",
        b.phone || "N/A",
        b.date || new Date().toLocaleDateString(),
      ]);

      autoTable(doc, {
        startY: 55,
        head: [["#", "Name", "Email", "Amount", "Address", "Phone", "Date"]],
        body: tableData,
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 102, 204] },
      });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(
        "SmartBills — A Utility Bill Management System",
        14,
        pageHeight - 10
      );

      doc.save("My_Paid_Bills_Report.pdf");

      toast.success("PDF report downloaded successfully!", {
        id: "pdf-download",
      });
      Swal.fire({
        title: "Success!",
        text: "Your bills report has been downloaded.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF report.", { id: "pdf-download" });
      Swal.fire({
        title: "Error!",
        text: "Failed to generate PDF report.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 card rounded-xl shadow-md">
      <h2
        className="text-3xl font-bold text-center mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        My Paid Bills
      </h2>

      <div className="flex justify-between items-center mb-6">
        <p
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Total Bills Paid: <span className="text-blue-600">{totalBills}</span>
        </p>
        <p
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Total Amount: <span className="text-green-600">৳{totalAmount}</span>
        </p>
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Download Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table
          className="table-auto w-full border text-sm"
          style={{ borderColor: "var(--border-color)" }}
        >
          <thead
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          >
            <tr>
              <th
                className="p-2 border"
                style={{ borderColor: "var(--border-color)" }}
              >
                Username
              </th>
              <th
                className="p-2 border"
                style={{ borderColor: "var(--border-color)" }}
              >
                Email
              </th>
              <th
                className="p-2 border"
                style={{ borderColor: "var(--border-color)" }}
              >
                Amount
              </th>
              <th
                className="p-2 border"
                style={{ borderColor: "var(--border-color)" }}
              >
                Address
              </th>
              <th
                className="p-2 border"
                style={{ borderColor: "var(--border-color)" }}
              >
                Phone
              </th>
              <th
                className="p-2 border"
                style={{ borderColor: "var(--border-color)" }}
              >
                Date
              </th>
              <th
                className="p-2 border"
                style={{ borderColor: "var(--border-color)" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr
                key={b._id}
                className="text-center"
                style={{
                  borderBottom: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                <td className="p-2">{b.username}</td>
                <td className="p-2">{b.email}</td>
                <td className="p-2">৳{b.amount}</td>
                <td className="p-2">{b.address}</td>
                <td className="p-2">{b.phone}</td>
                <td className="p-2">{b.date}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedBill(b);
                      setShowModal(true);
                    }}
                    className="px-3 py-1 bg-[#E5CBB8] text-black rounded-md hover:bg-[#E5CBB8]"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bills.length === 0 && (
          <p
            className="text-center py-6"
            style={{ color: "var(--text-secondary)" }}
          >
            No bills found.
          </p>
        )}
      </div>

      {showModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 hover:opacity-75"
              style={{ color: "var(--text-secondary)" }}
            >
              ✕
            </button>
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Update Bill
            </h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                name="username"
                defaultValue={selectedBill.username}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="address"
                defaultValue={selectedBill.address}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="phone"
                defaultValue={selectedBill.phone}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                name="amount"
                defaultValue={selectedBill.amount}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="date"
                name="date"
                defaultValue={selectedBill.date}
                className="w-full border p-2 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBills;
