import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import axiosInstance from "../utils/axiosConfig";
import { API_BASE_URL } from "../config/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MdReceipt,
  MdPayment,
  MdTrendingUp,
  MdDateRange,
} from "react-icons/md";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalAmount: 0,
    thisMonth: 0,
    lastMonth: 0,
  });

  useEffect(() => {
    if (user?.email) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/mybills?email=${user.email}`,
      );
      console.log("Dashboard API Response:", response.data);

      // Handle both array and object responses
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.bills || [];
      setBills(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthBills = data.filter((bill) => {
      const billDate = new Date(bill.paymentDate || bill.date);
      return (
        billDate.getMonth() === currentMonth &&
        billDate.getFullYear() === currentYear
      );
    });

    const lastMonthBills = data.filter((bill) => {
      const billDate = new Date(bill.paymentDate || bill.date);
      return (
        billDate.getMonth() === lastMonth &&
        billDate.getFullYear() === lastMonthYear
      );
    });

    const totalAmount = data.reduce(
      (sum, bill) => sum + parseFloat(bill.amount || 0),
      0,
    );
    const thisMonthAmount = thisMonthBills.reduce(
      (sum, bill) => sum + parseFloat(bill.amount || 0),
      0,
    );
    const lastMonthAmount = lastMonthBills.reduce(
      (sum, bill) => sum + parseFloat(bill.amount || 0),
      0,
    );

    setStats({
      totalBills: data.length,
      totalAmount: totalAmount,
      thisMonth: thisMonthAmount,
      lastMonth: lastMonthAmount,
    });
  };

  // Prepare chart data
  const getCategoryData = () => {
    const categories = {};
    bills.forEach((bill) => {
      const category = bill.category || "Other";
      categories[category] =
        (categories[category] || 0) + parseFloat(bill.amount || 0);
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  };

  const getMonthlyData = () => {
    const monthlyData = {};
    bills.forEach((bill) => {
      const date = new Date(bill.paymentDate || bill.date);
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      monthlyData[monthYear] =
        (monthlyData[monthYear] || 0) + parseFloat(bill.amount || 0);
    });

    return Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-6)
      .map(([month, amount]) => ({
        month,
        amount: parseFloat(amount.toFixed(2)),
      }));
  };

  const COLORS = [
    "#E5CBB8",
    "#D4A574",
    "#C38E56",
    "#B27742",
    "#A15F2E",
    "#906020",
  ];

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/70 font-medium">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {trend && (
              <p className="text-sm mt-2 flex items-center gap-1">
                <MdTrendingUp
                  className={trend > 0 ? "text-success" : "text-error"}
                />
                <span className={trend > 0 ? "text-success" : "text-error"}>
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
                <span className="text-base-content/60">vs last month</span>
              </p>
            )}
          </div>
          <div className={`p-4 rounded-full ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          <Skeleton width={300} />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <Skeleton height={100} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton height={400} />
          <Skeleton height={400} />
        </div>
      </div>
    );
  }

  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();
  const trend = stats.lastMonth
    ? (((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-base-content/70 mt-1">
            Welcome back, {user?.displayName || "User"}!
          </p>
        </div>
        <div className="flex items-center gap-2 text-base-content/70">
          <MdDateRange className="w-5 h-5" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={MdReceipt}
          title="Total Bills Paid"
          value={stats.totalBills}
          color="bg-blue-500"
        />
        <StatCard
          icon={MdPayment}
          title="Total Amount"
          value={`৳${stats.totalAmount.toFixed(2)}`}
          color="bg-green-500"
        />
        <StatCard
          icon={MdTrendingUp}
          title="This Month"
          value={`৳${stats.thisMonth.toFixed(2)}`}
          trend={parseFloat(trend)}
          color="bg-purple-500"
        />
        <StatCard
          icon={MdDateRange}
          title="Last Month"
          value={`৳${stats.lastMonth.toFixed(2)}`}
          color="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Line Chart */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-4">Monthly Spending Trend</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(229, 203, 184, 0.2)"
                  />
                  <XAxis dataKey="month" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--fallback-b1, oklch(var(--b1)))",
                      border:
                        "1px solid var(--fallback-bc, oklch(var(--bc) / 0.2))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#E5CBB8"
                    strokeWidth={3}
                    name="Amount (৳)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-base-content/60">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-4">Spending by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--fallback-b1, oklch(var(--b1)))",
                      border:
                        "1px solid var(--fallback-bc, oklch(var(--bc) / 0.2))",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-base-content/60">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Bar Chart */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Spending Breakdown by Category</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(229, 203, 184, 0.2)"
                />
                <XAxis dataKey="name" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--fallback-b1, oklch(var(--b1)))",
                    border:
                      "1px solid var(--fallback-bc, oklch(var(--bc) / 0.2))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#E5CBB8" name="Amount (৳)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-base-content/60">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title">Recent Transactions</h2>
            <Link to="/mybills" className="btn btn-sm btn-outline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            {bills.length > 0 ? (
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Provider</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.slice(0, 5).map((bill, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(
                          bill.paymentDate || bill.date,
                        ).toLocaleDateString()}
                      </td>
                      <td>{bill.category || "N/A"}</td>
                      <td>{bill.providerName || "N/A"}</td>
                      <td className="font-semibold">
                        ৳{parseFloat(bill.amount).toFixed(2)}
                      </td>
                      <td>
                        <span className="badge badge-success">Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-base-content/60">
                <MdReceipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No transactions yet</p>
                <Link to="/bills" className="btn btn-primary mt-4">
                  Pay Your First Bill
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
