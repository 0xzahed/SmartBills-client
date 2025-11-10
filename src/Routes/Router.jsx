import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../Pages/Home/Home";
import Bills from "../Pages/Bill/Bills";
import Auth from "../Auth/Auth";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Registretion/Register";

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