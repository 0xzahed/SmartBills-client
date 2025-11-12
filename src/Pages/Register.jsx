import { useState, useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createUser, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return regex.test(password)
      ? null
      : "Password must be at least 6 characters with 1 uppercase and 1 lowercase letter";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validatePassword(password);
    if (error) {
      toast.error(error);
      Swal.fire({
        title: "Invalid Password!",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    createUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (name || photoURL) {
          return updateProfile(user, { displayName: name, photoURL });
        }
      })
      .then(() => {
        toast.success("Account created successfully!");
        setLoading(false);

        Swal.fire({
          title: "Welcome to SmartBills!",
          text: "Your account has been created successfully!",
          icon: "success",
          confirmButtonText: "Get Started",
          confirmButtonColor: "#10b981",
        }).then(() => {
          navigate("/");
        });
      })
      .catch((err) => {
        console.error("Registration error:", err);
        setLoading(false);

        let errorMessage = "Registration failed. Please try again.";
        if (err.code === "auth/email-already-in-use") {
          errorMessage =
            "This email is already registered. Please login instead.";
        } else if (err.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (err.code === "auth/weak-password") {
          errorMessage =
            "Password is too weak. Please use a stronger password.";
        }

        toast.error(errorMessage);

        Swal.fire({
          title: "Registration Failed!",
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
        toast.success("Account created successfully!");
        setLoading(false);

        Swal.fire({
          title: "Welcome to SmartBills!",
          text: "Successfully registered with Google!",
          icon: "success",
          confirmButtonText: "Get Started",
          confirmButtonColor: "#10b981",
        }).then(() => {
          navigate("/");
        });
      })
      .catch((err) => {
        console.error("Google registration error:", err);
        setLoading(false);

        let errorMessage = "Google registration failed. Please try again.";
        if (err.code === "auth/popup-closed-by-user") {
          errorMessage = "Registration popup was closed. Please try again.";
        } else if (err.code === "auth/cancelled-popup-request") {
          errorMessage = "Registration was cancelled.";
        } else if (
          err.code === "auth/account-exists-with-different-credential"
        ) {
          errorMessage = "An account already exists with this email.";
        }

        toast.error(errorMessage);

        Swal.fire({
          title: "Registration Failed!",
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
          Create an Account
        </h2>
        <p
          className="text-center mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Register to start managing your utility bills efficiently.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block mb-1 font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              Photo URL
            </label>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="Enter your photo URL"
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
                placeholder="Enter password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="shine-btn w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="flex items-center gap-2 mt-6 mb-4">
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


        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
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

export default Register;
