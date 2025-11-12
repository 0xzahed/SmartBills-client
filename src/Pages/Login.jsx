import { useState, useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    signIn(email, password)
      .then(() => {
        toast.success("Welcome back! Login successful!");
        setLoading(false);

        Swal.fire({
          title: "Login Successful!",
          text: "Welcome back to SmartBills!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Login error:", error);
        setLoading(false);

        let errorMessage = "Login failed. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (error.code === "auth/invalid-credential") {
          errorMessage = "Invalid email or password.";
        }

        toast.error(errorMessage);

        Swal.fire({
          title: "Login Failed!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
  };

  const handleGoogleSignIn = () => {
    setLoading(true);

    googleSignIn()
      .then(() => {
        toast.success("Google sign-in successful!");
        setLoading(false);

        Swal.fire({
          title: "Welcome!",
          text: "Successfully signed in with Google!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        setLoading(false);

        let errorMessage = "Google sign-in failed. Please try again.";
        if (error.code === "auth/popup-closed-by-user") {
          errorMessage = "Sign-in popup was closed. Please try again.";
        } else if (error.code === "auth/cancelled-popup-request") {
          errorMessage = "Sign-in was cancelled.";
        }

        toast.error(errorMessage);

        Swal.fire({
          title: "Sign-in Failed!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 card shadow-2xl rounded-2xl w-[90%] max-w-md p-8"
      >
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome Back
        </h2>
        <p
          className="text-center mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Sign in to access your SmartBills dashboard
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full border rounded-lg py-3 hover:opacity-90 transition duration-300 disabled:opacity-60"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <FcGoogle className="text-2xl" />
          <span
            className="font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Continue with Google
          </span>
        </button>

        <div className="flex items-center gap-2 my-6">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "var(--border-color)" }}
          ></div>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            or
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "var(--border-color)" }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block mb-1 font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              className="block mb-1 font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <label
                className="text-sm flex items-center gap-2 cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember Me
              </label>
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="shine-btn w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>

        <div
          className="mt-6 text-center text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          © {new Date().getFullYear()} Utility Bill Management System
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
