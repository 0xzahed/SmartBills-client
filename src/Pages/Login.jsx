import { useState, useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

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
        toast.success("Login successful!", { duration: 4000 });
        setLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error(error.message || "Login failed. Please try again.");
        setLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    googleSignIn()
      .then(() => {
        toast.success("Login successful!", { duration: 4000 });
        setLoading(false);
        navigate(from, { replace: true });
      })
      .catch(() => {
        toast.error("Google sign-in failed. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e0d0d] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-800/20 to-black opacity-90"></div>
      <div className="absolute inset-0 grid grid-cols-12 gap-2 opacity-20">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="bg-red-600 rounded-lg aspect-square animate-pulse"
            style={{
              animationDelay: `${i * 0.05}s`,
              opacity: Math.random() * 0.2,
            }}
          ></div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl w-[90%] max-w-md p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to your Utility Bill Management account
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition duration-300 disabled:opacity-60"
        >
          <FcGoogle className="text-2xl" />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
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
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
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
              <label className="text-sm text-gray-600 flex items-center gap-2 cursor-pointer">
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
          <p className="text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Utility Bill Management System
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
