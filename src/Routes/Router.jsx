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
        path: "bills",
        Component: Bills,
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
        path: "*",
        Component: ErrorPage,
      },
      {
        path: "bills/:id",
        element: (
          <PrivateRoute>
            <BillDetails></BillDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "mybills",
        element: (
          <PrivateRoute>
            <MyBills></MyBills>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
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
]);

export default router;
