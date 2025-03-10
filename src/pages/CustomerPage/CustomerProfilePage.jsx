import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
} from "lucide-react";
const CustomerProfile = () => {
  // Mock customer data
  const customer = {
    id: "CUS001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    joinDate: "January 2023",
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=000&color=fff&size=128",
    stats: {
      totalTrips: 48,
      totalSpent: "$1,234",
      avgRating: 4.8,
      lastRide: "2 days ago",
    },
  };
  // Mock booking history
  const bookingHistory = [
    {
      id: "B001",
      date: "2024-01-20",
      from: "Airport Terminal 1",
      to: "Downtown Hotel",
      amount: "$35",
      status: "Completed",
      driver: "Mike Wilson",
      rating: 5,
    },
    {
      id: "B002",
      date: "2024-01-15",
      from: "Central Park",
      to: "Brooklyn Bridge",
      amount: "$28",
      status: "Completed",
      driver: "Sarah Chen",
      rating: 4,
    },
    {
      id: "B003",
      date: "2024-01-10",
      from: "Times Square",
      to: "Madison Square Garden",
      amount: "$22",
      status: "Cancelled",
      driver: "-",
      rating: null,
    },
    // Add more booking history as needed
  ];
  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      {/* Profile Header */}
      <div className="bg-black rounded-2xl p-6 text-white border border-white/5 shadow-lg">
        <div className="flex items-start gap-6">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-24 h-24 rounded-xl border-2 border-yellow-400/20"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{customer.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Member since {customer.joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black rounded-2xl p-6 text-white border border-white/5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Total Trips</p>
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <CalendarCheck className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{customer.stats.totalTrips}</p>
        </div>
        <div className="bg-black rounded-2xl p-6 text-white border border-white/5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Total Spent</p>
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{customer.stats.totalSpent}</p>
        </div>
        <div className="bg-black rounded-2xl p-6 text-white border border-white/5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Average Rating</p>
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">
            {customer.stats.avgRating}/5
          </p>
        </div>
        <div className="bg-black rounded-2xl p-6 text-white border border-white/5 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Last Ride</p>
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{customer.stats.lastRide}</p>
        </div>
      </div>
      {/* Booking History */}
      <div className="bg-black rounded-2xl p-6 text-white border border-white/5 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <CalendarCheck className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Booking History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-white/10">
                <th className="text-left pb-3">Booking ID</th>
                <th className="text-left pb-3">Date</th>
                <th className="text-left pb-3">From</th>
                <th className="text-left pb-3">To</th>
                <th className="text-left pb-3">Driver</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Rating</th>
                <th className="text-right pb-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookingHistory.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-white/5 text-sm"
                >
                  <td className="py-4">{booking.id}</td>
                  <td className="py-4">{booking.date}</td>
                  <td className="py-4">{booking.from}</td>
                  <td className="py-4">{booking.to}</td>
                  <td className="py-4">{booking.driver}</td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs 
                      ${booking.status === "Completed" ? "bg-green-500/20 text-green-400" : booking.status === "In Progress" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4">
                    {booking.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{booking.rating}</span>
                      </div>
                    ) : (
                      "-"
                    )}
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
export default CustomerProfile;
