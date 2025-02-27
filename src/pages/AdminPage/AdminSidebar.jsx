import { LayoutDashboard, Car, Users, CreditCard, ClipboardList, LogOut } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 shadow-xl flex flex-col">
      <h2 className="text-3xl font-bold mb-8 text-center tracking-wide">Admin Panel</h2>
      <nav className="space-y-4 flex-1">
        {["dashboard", "bookings", "cabs", "users", "payments"].map((tab) => (
          <button
            key={tab}
            className={`flex items-center justify-start space-x-4 w-full text-left p-4 rounded-lg transition-all font-medium ${
              activeTab === tab ? "bg-emerald-600 shadow-md" : "hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "dashboard" && <LayoutDashboard className="w-6 h-6" />}
            {tab === "bookings" && <ClipboardList className="w-6 h-6" />}
            {tab === "cabs" && <Car className="w-6 h-6" />}
            {tab === "users" && <Users className="w-6 h-6" />}
            {tab === "payments" && <CreditCard className="w-6 h-6" />}
            <span className="capitalize text-lg">{tab}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4 bg-red-600 hover:bg-red-700 transition-all rounded-lg shadow-md">
        <button className="flex items-center space-x-4 w-full text-left text-white font-medium">
          <LogOut className="w-6 h-6" />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
