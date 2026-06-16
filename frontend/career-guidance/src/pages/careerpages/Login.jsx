import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import sideImg from "../../assets/studentImage (2).png";
const API = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else if (err.request) {
        setError("Backend not reachable");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* LEFT – IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:block"
      >
        <img
          src={sideImg}
          alt="Student Login Illustration"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* RIGHT – LOGIN FORM */}
      <div className="flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-md p-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-3 text-blue-600">
              <LogIn size={36} />
            </div>
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-gray-600 text-sm">
              Login to continue your career journey
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg text-sm"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <motion.div whileFocus={{ scale: 1.03 }} className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </motion.div>

            {/* Password */}
            <motion.div whileFocus={{ scale: 1.03 }} className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            {/* Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?
            <button
              onClick={() => navigate("/register")}
              className="ml-1 text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
            >
              <UserPlus size={16} />
              Register
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
