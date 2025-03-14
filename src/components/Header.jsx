import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import axios from "axios";
import logo from "../assets/logo4.svg";

const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    userName: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !user.userId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const endpoint =
          user.role === "ROLE_DRIVER"
            ? `http://localhost:8080/auth/driver/getdriver/${user.userId}`
            : `http://localhost:8080/auth/customer/getcustomer/${user.userId}`;
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        if (response.data) {
          const { userName, profileImage } = response.data;
          const imageUrl =
            profileImage && profileImage.startsWith("http")
              ? profileImage
              : `http://localhost:8080${profileImage}`;
          setProfile({
            userName,
            profileImage: imageUrl,
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setProfile({
          userName: "",
          profileImage: "/default-profile.jpg",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`relative text-black hover:text-[#F9C80E] transition-colors px-4 py-2 text-sm font-medium group ${isActive ? "text-[#F9C80E]" : ""}`}
      >
        {children}
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F9C80E] transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
      </Link>
    );
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white w-full fixed top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center py-4">
                <span className="text-2xl font-bold text-black">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-[250px] h-[250px] object-contain mb-5 mt-20"
                  />
                </span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/driverSignup">Drive</NavLink>
            </nav>
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/booking">
                <button className="px-6 py-2.5 text-sm font-medium text-black bg-[#F9C80E] rounded-lg hover:bg-[#F9C80E]/90 focus:outline-none focus:ring-2 focus:ring-[#F9C80E] focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  Book A Cab
                </button>
              </Link>
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-3 focus:outline-none group">
                    {isLoading ? (
                      <div className="w-10 h-10 rounded-full bg-[#F9C80E]/20 animate-pulse" />
                    ) : (
                      <div className="relative">
                        <img
                          src={profile.profileImage}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#F9C80E] group-hover:border-[#F9C80E]/80 transition-colors shadow-md"
                          onError={(e) => {
                            e.currentTarget.src = "/default-profile.jpg";
                          }}
                        />
                        <ChevronDown className="w-4 h-4 text-[#F9C80E] absolute -right-6 top-1/2 -translate-y-1/2" />
                      </div>
                    )}
                  </button>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-100">
                    <div className="px-4 py-3 text-sm font-medium text-[#F9C80E] border-b border-gray-100 capitalize">
                      {user.role?.replace("ROLE_", "").toLowerCase()}
                    </div>
                    {user.role === "ROLE_DRIVER" && (
                      <Link
                        to="/driverProfile"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#F9C80E] hover:bg-gray-50 transition-colors"
                      >
                        Dashboard
                      </Link>
                    )}
                    {user.role === "ROLE_CUSTOMER" && (
                      <Link
                        to="/cusProfile"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#F9C80E] hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-[#F9C80E] hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <button 
                  id ="login"
                  className="px-6 py-2.5 text-sm font-medium text-[#F9C80E] bg-white border-2 border-[#F9C80E] rounded-lg hover:bg-[#F9C80E]/10 focus:outline-none focus:ring-2 focus:ring-[#F9C80E] focus:ring-offset-2 transition-all duration-200">
                    Login
                  </button>
                </Link>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-black hover:text-[#F9C80E] hover:bg-[#F9C80E]/10 focus:outline-none focus:ring-2 focus:ring-[#F9C80E] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 invisible"}`}
        >
          <nav className="px-4 pt-2 pb-6 border-t border-gray-100 bg-white shadow-inner">
            <div className="space-y-2">
              <Link
                to="/"
                className="relative block px-4 py-3 text-base font-medium text-black hover:text-[#F9C80E] hover:bg-[#F9C80E]/5 rounded-lg transition-colors"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F9C80E] transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
              </Link>
              <Link
                to="/about"
                className="relative block px-4 py-3 text-base font-medium text-black hover:text-[#F9C80E] hover:bg-[#F9C80E]/5 rounded-lg transition-colors"
              >
                About
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F9C80E] transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
              </Link>
              <Link
                to="/contact"
                className="relative block px-4 py-3 text-base font-medium text-black hover:text-[#F9C80E] hover:bg-[#F9C80E]/5 rounded-lg transition-colors"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F9C80E] transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
              </Link>
              {user?.role === "ROLE_DRIVER" && (
                <Link
                  to="/driverProfile"
                  className="relative block px-4 py-3 text-base font-medium text-black hover:text-[#F9C80E] hover:bg-[#F9C80E]/5 rounded-lg transition-colors"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F9C80E] transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
                </Link>
              )}
              {user?.role === "ROLE_CUSTOMER" && (
                <Link
                  to="/cusProfile"
                  className="relative block px-4 py-3 text-base font-medium text-black hover:text-[#F9C80E] hover:bg-[#F9C80E]/5 rounded-lg transition-colors"
                >
                  Profile
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F9C80E] transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100" />
                </Link>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link to="/booking" className="block mb-4">
                <button className="w-full px-4 py-3 text-sm font-medium text-black bg-[#F9C80E] rounded-lg hover:bg-[#F9C80E]/90 focus:outline-none focus:ring-2 focus:ring-[#F9C80E] transition-all duration-200 shadow-md">
                  Book A Cab
                </button>
              </Link>
              {user ? (
                <div className="flex flex-col items-center">
                  {isLoading ? (
                    <div className="w-14 h-14 rounded-full bg-[#F9C80E]/20 animate-pulse" />
                  ) : (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#F9C80E] shadow-md"
                      onError={(e) => {
                        e.currentTarget.src = "/default-profile.jpg";
                      }}
                    />
                  )}
                  <button
                    onClick={logout}
                    className="mt-6 w-full px-4 py-3 text-sm font-medium text-[#F9C80E] bg-[#F9C80E]/5 rounded-lg hover:bg-[#F9C80E]/10 focus:outline-none focus:ring-2 focus:ring-[#F9C80E] transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="block">
                  <button className="w-full px-4 py-3 text-sm font-medium text-[#F9C80E] bg-white border-2 border-[#F9C80E] rounded-lg hover:bg-[#F9C80E]/5 focus:outline-none focus:ring-2 focus:ring-[#F9C80E] transition-all duration-200">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;