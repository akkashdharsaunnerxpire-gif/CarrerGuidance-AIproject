import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import sideImg from "../../assets/studentImage (2).png";
const API = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    degree: "",
    department: "",
    year: "",
    skills: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.gender ||
      !formData.degree ||
      !formData.department ||
      !formData.skills ||
      !formData.password
    ) {
      return setError("All fields are required");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      await axios.post(`${API}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        degree: formData.degree,
        department: formData.department,
        year: formData.year,
        skills: formData.skills,
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* LEFT – IMAGE */}
      <div className="hidden md:block">
        <img
          src={sideImg}
          alt="Student Register Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT – REGISTER FORM */}
      <div className="flex flex-auto items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-6">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Student Registration
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Create your profile to get AI career guidance
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="input"
            />
            <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="input"
            />

            <select name="gender" onChange={handleChange} className="input">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              name="degree"
              placeholder="Degree (B.E / B.Tech)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="department"
              placeholder="Department"
              onChange={handleChange}
              className="input"
            />
            <input
              name="year"
              placeholder="Year (1 / 2 / 3 / 4)"
              onChange={handleChange}
              className="input"
            />

            <input
              name="skills"
              placeholder="Skills (Python, Java, AI)"
              onChange={handleChange}
              className="input md:col-span-2"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?
            <button
              onClick={() => navigate("/")}
              className="ml-1 text-indigo-600 font-medium hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
