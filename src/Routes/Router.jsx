import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Auth from "../Auth/Auth";
import Home from "../Pages/Home";
import Bills from "../Pages/Bills";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'bills',
                Component: Bills
            }
        ]
    },
    {
        path: 'auth',
        Component: Auth,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    }
])



export default router;