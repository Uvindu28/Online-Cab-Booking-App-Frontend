import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    alert("Login successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Customer Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Name Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your Text"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Address Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your Address"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* NIC Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="Enter your NIC"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Phone Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your Phone"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-md font-semibold hover:bg-emerald-600 transition-all"
          >
            Sign Up
          </button>

          {/* Links */}
          <div className="text-center text-sm text-gray-600 mt-4">
            <p>
              Already have an account?{" "}
              <Link to="/customerlogin" className="text-emerald-500 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
