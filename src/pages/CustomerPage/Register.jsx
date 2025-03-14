import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, CarIcon, Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../utils/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    nic: "",
    phone: "",
    password: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("nic", formData.nic);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/customer/createcustomer",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Registration response:", response.data);

      const { token, userId, role } = response.data;

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      login(token);

      // Assuming successful registration redirects to home page
      navigate("/");

    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError("Invalid input data. Please check your information");
            break;
          case 409:
            setError("Email already exists");
            break;
          case 500:
            setError("Server error. Please try again later");
            break;
          default:
            setError("Registration failed. Please try again");
        }
      } else if (error.request) {
        setError("Cannot connect to server. Please check your internet connection");
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-yellow-400/10 rotate-12 transform scale-150" />
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-yellow-400/5 -rotate-12 transform scale-150" />
      </div>
      <div className="max-w-md w-full backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl relative transition-transform hover:scale-[1.01] duration-300">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <CarIcon size={32} className="text-black" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white bg-clip-text">
            Create Account
          </h2>
          <p className="mt-2 text-gray-400">Join MegaCityCab today</p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100/10 border border-red-400/20 text-red-300 rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Name
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="mt-1 w-full pl-10 px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                    placeholder="Full name"
                  />
                </div>
              </div>
              <div className="group">
                <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className="group">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="mt-1 w-full pl-10 px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="group">
              <label htmlFor="address" className="text-sm font-medium text-gray-300">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your address"
              />
            </div>
            <div className="group">
              <label htmlFor="nic" className="text-sm font-medium text-gray-300">
                NIC
              </label>
              <input
                id="nic"
                name="nic"
                type="text"
                value={formData.nic}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your NIC"
              />
            </div>
            <div className="group">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>
            <div className="group">
              <label htmlFor="profileImage" className="text-sm font-medium text-gray-300">
                Profile Image
              </label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                onChange={handleChange}
                accept="image/*"
                disabled={isLoading}
                className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
              />
            </div>
          </div>
          {/* <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              disabled={isLoading}
              className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-700 rounded bg-white/10"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              I agree to the{" "}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                Privacy Policy
              </a>
            </label>
          </div> */}
          <button
            id ="login"
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border-0 rounded-xl text-black font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] transition-all duration-200 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;