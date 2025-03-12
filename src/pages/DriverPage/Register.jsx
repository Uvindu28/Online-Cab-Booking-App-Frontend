import { useState } from "react";
import { Lock, Mail, User, CarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    driverName: "",
    email: "",
    driverLicense: "",
    phone: "",
    password: "",
    hasOwnCar: false,
    licensePlate: "",
    model: "",
    numberOfSeats: "",
    baseRate: "",
    driverRate: "",
    carImage: null,
    profileImage: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = new FormData();
    data.append("driverName", formData.driverName);
    data.append("email", formData.email);
    data.append("driverLicense", formData.driverLicense);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("hasOwnCar", formData.hasOwnCar);
    
    if (formData.hasOwnCar) {
      data.append("licensePlate", formData.licensePlate);
      data.append("model", formData.model);
      data.append("numberOfSeats", formData.numberOfSeats || 4);
      data.append("baseRate", formData.baseRate);
      data.append("driverRate", formData.driverRate);
      if (formData.carImage) {
        data.append("carImage", formData.carImage);
      }
    }
    
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      const response = await fetch("http://localhost:8080/auth/driver/createdriver", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration Data:", result);
        toast("Driver registration successful!");
      } else {
        const error = await response.text();
        setError("Registration failed: " + error);
        toast("Registration failed: " + error);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred during registration.");
      toast("An error occurred during registration.");
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
            Driver Registration
          </h2>
          <p className="mt-2 text-gray-400">Join MegaCityCab as a Driver</p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100/10 border border-red-400/20 text-red-300 rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-5">
            <div className="group">
              <label htmlFor="driverName" className="text-sm font-medium text-gray-300">
                Driver Name
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="driverName"
                  name="driverName"
                  type="text"
                  value={formData.driverName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                  placeholder="Enter your name"
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
                  className="w-full pl-10 px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="driverLicense" className="text-sm font-medium text-gray-300">
                Driver License
              </label>
              <input
                id="driverLicense"
                name="driverLicense"
                type="text"
                value={formData.driverLicense}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                placeholder="Enter your driver license"
              />
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
                placeholder="Enter your phone"
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

            <div className="flex items-center">
              <input
                id="hasOwnCar"
                name="hasOwnCar"
                type="checkbox"
                checked={formData.hasOwnCar}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-700 rounded bg-white/10"
              />
              <label htmlFor="hasOwnCar" className="ml-2 text-sm text-gray-300">
                Do you have your own car?
              </label>
            </div>

            {formData.hasOwnCar && (
              <>
                <div className="group">
                  <label htmlFor="licensePlate" className="text-sm font-medium text-gray-300">
                    License Plate
                  </label>
                  <input
                    id="licensePlate"
                    name="licensePlate"
                    type="text"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                    placeholder="Enter license plate"
                  />
                </div>

                <div className="group">
                  <label htmlFor="model" className="text-sm font-medium text-gray-300">
                    Car Model
                  </label>
                  <input
                    id="model"
                    name="model"
                    type="text"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                    placeholder="Enter car model"
                  />
                </div>

                <div className="group">
                  <label htmlFor="numberOfSeats" className="text-sm font-medium text-gray-300">
                    Number of Seats
                  </label>
                  <input
                    id="numberOfSeats"
                    name="numberOfSeats"
                    type="number"
                    value={formData.numberOfSeats}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                    placeholder="Number of seats (default: 4)"
                  />
                </div>

                <div className="group">
                  <label htmlFor="baseRate" className="text-sm font-medium text-gray-300">
                    Base Rate
                  </label>
                  <input
                    id="baseRate"
                    name="baseRate"
                    type="number"
                    value={formData.baseRate}
                    onChange={handleChange}
                    step="0.01"
                    disabled={isLoading}
                    className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                    placeholder="Enter base rate"
                  />
                </div>

                <div className="group">
                  <label htmlFor="driverRate" className="text-sm font-medium text-gray-300">
                    Driver Rate
                  </label>
                  <input
                    id="driverRate"
                    name="driverRate"
                    type="number"
                    value={formData.driverRate}
                    onChange={handleChange}
                    step="0.01"
                    disabled={isLoading}
                    className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                    placeholder="Enter driver rate"
                  />
                </div>

                <div className="group">
                  <label htmlFor="carImage" className="text-sm font-medium text-gray-300">
                    Car Image
                  </label>
                  <input
                    id="carImage"
                    name="carImage"
                    type="file"
                    onChange={handleChange}
                    accept="image/*"
                    disabled={isLoading}
                    className="mt-1 w-full px-4 py-3 bg-white/10 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-200 placeholder-gray-500"
                  />
                </div>
              </>
            )}

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

            <div className="flex items-center">
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
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 border-0 rounded-xl text-black font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] transition-all duration-200 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Registering..." : "Register as Driver"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/driverlogin"
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