import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, CarIcon, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        formData
      );
      
      console.log("Login response:", response.data);
      
      const { token, userId, role } = response.data;
      
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      login(token);

      switch (role) {
        case "ROLE_ADMIN":
          navigate("/admin/dashboard");
          break;
        case "ROLE_CUSTOMER":
          navigate("/");
          break;
        case "ROLE_DRIVER":
          navigate("/driverProfile");
          break;
        default:
          setError("Invalid user role");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Invalid email or password");
            break;
          case 404:
            setError("User not found");
            break;
          case 403:
            setError("Account is locked. Please contact support");
            break;
          default:
            setError("Login failed. Please try again later");
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
            Welcome back
          </h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100/10 border border-red-400/20 text-red-300 rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
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
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-700 rounded bg-white/10"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <Link
              to="/forgotPassword"
              className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border-0 rounded-xl text-black font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] transition-all duration-200 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/customerSignup"
            className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;