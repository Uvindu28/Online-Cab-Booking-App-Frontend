import { useState } from "react";
import {
  Car,
  Users,
  CreditCard,
  ClipboardList,
  LogOut,
} from "lucide-react";
import AdminDashboard from "./AdminDashboard";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <aside className="w-72 fixed top-0 left-0 h-[700px] m-2.5 bg-[#071013] text-white rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col border border-white/5">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
          Admin Panel
        </h2>
        <div className="h-0.5 w-12 bg-gradient-to-r from-yellow-400 to-yellow-500 mt-2"></div>
      </div>
      <nav className="space-y-1.5 flex-1">
        {["dashboard", "bookings", "cabs", "users", "payments"].map((tab) => (
          <button
            key={tab}
            className={`group flex items-center justify-start w-full p-2.5 rounded-xl transition-all duration-200 ease-in-out
              ${activeTab === tab ? "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 text-white shadow-lg border border-yellow-500/20" : "hover:bg-white/5 text-gray-400 hover:text-white border border-transparent"}`}
            onClick={() => setActiveTab(tab)}
          >
            <div
              className={`p-2 rounded-lg mr-3 transition-all duration-200
              ${activeTab === tab ? "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-lg" : "bg-gray-900 group-hover:bg-gray-800"}`}
            >
              {tab === "/admin/dashboard" && <AdminDashboard className="w-4 h-4" />}
              {tab === "bookings" && <ClipboardList className="w-4 h-4" />}
              {tab === "cabs" && <Car className="w-4 h-4" />}
              {tab === "users" && <Users className="w-4 h-4" />}
              {tab === "payments" && <CreditCard className="w-4 h-4" />}
            </div>
            <span className="text-sm font-medium capitalize">{tab}</span>
            {activeTab === tab && (
              <div className="ml-auto w-1 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
            )}
          </button>
        ))}
      </nav>
      <div className="pt-4">
        <button
          className="flex items-center w-full p-2.5 rounded-xl transition-all duration-200 
          bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800
          shadow-lg hover:shadow-xl text-white border border-white/5"
        >
          <div className="p-2 rounded-lg mr-3 bg-white/10">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
