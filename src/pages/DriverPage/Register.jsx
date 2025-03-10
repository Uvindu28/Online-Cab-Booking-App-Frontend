import { useState } from "react";
import { Lock, Mail, User } from "lucide-react"; // Added User icon for name field
import { Link } from "react-router-dom";

const Register = () => {
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
      setFormData({ ...formData, [name]: files[0] }); // Handle file input
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await fetch("http://localhost:8080/auth/customer/createcustomer", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration Data:", result);
        alert("Registration successful!");
      } else {
        const error = await response.text();
        alert("Registration failed: " + error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Driver Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none"
            />
          </div>

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

          {/* Address Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
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
              placeholder="Enter your phone"
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

          {/* Profile Image Input */}
          <div className="relative">
            <input
              type="file"
              name="profileImage"
              onChange={handleChange}
              accept="image/*"
              className="w-full py-3 border rounded-md focus:border-emerald-500 focus:ring-emerald-500 outline-none"
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