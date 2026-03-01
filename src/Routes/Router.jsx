import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Auth from "../Auth/Auth";
import Home from "../Pages/Home";
import Bills from "../Pages/Bills";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import BillDetails from "../Pages/BillDetails";
import PrivateRoute from "./PrivateRoute";
import MyBills from "../Pages/MyBills";
import Profile from "../Pages/Profile";
import AboutUs from "../Pages/AboutUs";
import ContactUs from "../Pages/ContactUs";
import ErrorPage from "../Pages/ErrorPage";
import Insights from "../Pages/Insights";
import Providers from "../Pages/Providers";
import PaymentGateway from "../Pages/PaymentGateway";
import Dashboard from "../Pages/Dashboard";
import FAQ from "../Pages/FAQ";
import DashboardLayout from "../Layouts/DashboardLayout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "about",
        Component: AboutUs,
      },
      {
        path: "contact",
        Component: ContactUs,
      },
      {
        path: "faq",
        Component: FAQ,
      },
      {
        path: "bills",
        Component: Bills,
      },
      {
        path: "providers",
        Component: Providers,
      },
      {
        path: "bills/:id",
        Component: BillDetails,
      },
      {
        path: "payment/:id",
        element: (
          <PrivateRoute>
            <PaymentGateway />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    // Admin Panel with Sidebar
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "insights",
        Component: Insights,
      },
      {
        path: "mybills",
        Component: MyBills,
      },
    ],
  },
  {
    path: "auth",
    Component: Auth,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

export default router;
