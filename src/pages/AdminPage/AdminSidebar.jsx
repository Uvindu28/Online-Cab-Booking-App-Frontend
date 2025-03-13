import React, { useEffect, useState } from "react";
import {
  LayoutDashboardIcon,
  UsersIcon,
  CarIcon,
  CalendarIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOutIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import axios from "axios";

const AdminSidebar = ({ collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth(); // Destructure user and logout from context
  const [profile, setProfile] = useState({
    userName: "Admin User",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const navigationItems = [
    { icon: React.createElement(LayoutDashboardIcon, { size: 20 }), label: "Dashboard", active: true, path: "/admin/dashboard" },
    { icon: React.createElement(UsersIcon, { size: 20 }), label: "Drivers", path: "/admin/drivers" },
    { icon: React.createElement(CarIcon, { size: 20 }), label: "Vehicles", path: "/admin/cars" },
    { icon: React.createElement(CalendarIcon, { size: 20 }), label: "Bookings", path: "/admin/bookings" },
    { icon: React.createElement(UserIcon, { size: 20 }), label: "Customers", path: "/admin/customers" },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !user.userId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const endpoint = `http://localhost:8080/auth/admin/getadmin/${user.userId}`;
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
            userName: userName || "Admin User",
            profileImage: imageUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching admin profile data:", error);
        setProfile({
          userName: "Admin User",
          profileImage: "/default-profile.jpg",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  return React.createElement(
    "aside",
    {
      className: `${collapsed ? "w-20" : "w-64"} bg-black text-white h-screen transition-width duration-300 ease-in-out flex flex-col`,
    },
    [
      // Logo Section
      React.createElement(
        "div",
        {
          className: "flex items-center justify-between p-4 border-b border-gray-800",
          key: "logo-section",
        },
        [
          React.createElement(
            "div",
            { className: "flex items-center", key: "logo" },
            [
              React.createElement(
                "div",
                {
                  className: "bg-yellow-400 rounded-md p-2 flex items-center justify-center",
                  key: "logo-icon",
                },
                React.createElement(CarIcon, { className: "text-black", size: 24 })
              ),
              !collapsed &&
                React.createElement(
                  "span",
                  { className: "ml-3 font-bold text-lg text-yellow-400", key: "logo-text" },
                  "MegaCityCab"
                ),
            ]
          ),
          React.createElement(
            "button",
            {
              onClick: onToggleCollapse,
              className: "p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white",
              key: "collapse-button",
            },
            collapsed
              ? React.createElement(ChevronRightIcon, { size: 20 })
              : React.createElement(ChevronLeftIcon, { size: 20 }) // Fixed from previous version
          ),
        ]
      ),

      // Navigation
      React.createElement(
        "nav",
        { className: "flex-1 py-4 overflow-y-auto", key: "navigation" },
        React.createElement(
          "ul",
          { key: "navigation-list" },
          navigationItems.map((item, index) =>
            React.createElement(
              "li",
              { key: index },
              React.createElement(
                Link,
                {
                  to: item.path,
                  className: `flex items-center py-3 px-4 ${
                    item.active ? "bg-yellow-400 text-black" : "text-gray-300 hover:bg-gray-800"
                  } ${collapsed ? "justify-center" : ""}`,
                },
                [
                  React.createElement("span", { className: "flex-shrink-0", key: "icon" }, item.icon),
                  !collapsed &&
                    React.createElement(
                      "span",
                      { className: "ml-3", key: "label" },
                      item.label
                    ),
                ]
              )
            )
          )
        )
      ),

      // User Profile
      React.createElement(
        "div",
        {
          className: `p-4 border-t border-gray-800 ${collapsed ? "flex justify-center" : ""}`,
          key: "user-profile",
        },
        React.createElement(
          "div",
          { className: `flex items-center ${collapsed ? "justify-center" : ""}`, key: "profile" },
          [
            isLoading
              ? React.createElement(
                  "div",
                  {
                    className: "w-10 h-10 rounded-full bg-yellow-400/20 animate-pulse",
                    key: "loading",
                  }
                )
              : React.createElement(
                  "div",
                  {
                    className: "w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center",
                    key: "profile-icon",
                  },
                  profile.profileImage
                    ? React.createElement("img", {
                        src: profile.profileImage,
                        alt: "Profile",
                        className: "w-10 h-10 rounded-full object-cover",
                        onError: (e) => {
                          e.currentTarget.src = "/default-profile.jpg";
                        },
                      })
                    : React.createElement(UserIcon, { size: 20, className: "text-black" })
                ),
            !collapsed &&
              React.createElement(
                "div",
                { className: "ml-3", key: "profile-details" },
                [
                  React.createElement(
                    "p",
                    { className: "text-sm font-medium", key: "username" },
                    profile.userName
                  ),
                  React.createElement(
                    "button", // Using button like in Header
                    {
                      className: "flex items-center text-xs text-gray-400 mt-1 hover:text-yellow-400 cursor-pointer",
                      key: "logout",
                      onClick: logout, // Directly use logout from useAuth, like in Header
                    },
                    [
                      React.createElement(LogOutIcon, { size: 14, className: "mr-1", key: "logout-icon" }),
                      React.createElement("span", { key: "logout-text" }, "Logout"),
                    ]
                  ),
                ]
              ),
          ]
        )
      ),
    ]
  );
};

export default AdminSidebar;