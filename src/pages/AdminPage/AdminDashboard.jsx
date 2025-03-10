import { Users, Car, CalendarCheck, DollarSign, Clock } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      icon: <CalendarCheck className="w-5 h-5 text-yellow-400" />,
      change: "+12%",
    },
    {
      title: "Active Drivers",
      value: "89",
      icon: <Users className="w-5 h-5 text-yellow-400" />,
      change: "+5%",
    },
    {
      title: "Available Cabs",
      value: "156",
      icon: <Car className="w-5 h-5 text-yellow-400" />,
      change: "+8%",
    },
    {
      title: "Total Earnings",
      value: "$12,345",
      icon: <DollarSign className="w-5 h-5 text-yellow-400" />,
      change: "+15%",
    },
  ];

  const recentBookings = [
    { id: "B001", customer: "John Doe", date: "2024-01-20", status: "Completed", amount: "$35" },
    { id: "B002", customer: "Jane Smith", date: "2024-01-20", status: "In Progress", amount: "$42" },
    { id: "B003", customer: "Mike Johnson", date: "2024-01-19", status: "Cancelled", amount: "$28" },
    { id: "B004", customer: "Sarah Williams", date: "2024-01-19", status: "Completed", amount: "$55" },
    { id: "B005", customer: "Tom Brown", date: "2024-01-19", status: "In Progress", amount: "$31" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#071013] rounded-2xl p-6 text-white border border-white/5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2 text-white">{stat.value}</h3>
              </div>
              <div className="p-2 bg-yellow-400/10 rounded-lg">{stat.icon}</div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-green-400">{stat.change}</span>
              <span className="text-gray-400 ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#071013] rounded-2xl p-6 text-white border border-white/5 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-white/10">
                <th className="text-left pb-3">Booking ID</th>
                <th className="text-left pb-3">Customer</th>
                <th className="text-left pb-3">Date</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-right pb-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 text-sm">
                  <td className="py-4">{booking.id}</td>
                  <td className="py-4">{booking.customer}</td>
                  <td className="py-4">{booking.date}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${booking.status === "Completed" ? "bg-green-500/20 text-green-400" : 
                      booking.status === "In Progress" ? "bg-yellow-500/20 text-yellow-400" : 
                      "bg-red-500/20 text-red-400"}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">{booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
