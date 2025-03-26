import { cloneElement, useState, useEffect } from "react";
import {
  CalendarCheckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  DollarSignIcon,
  UserIcon,
  ChevronRightIcon,
  XCircleIcon,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../utils/AuthContext"; // Adjust the import path based on your file structure
import { Link } from "react-router-dom";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const { user } = useAuth(); // Get the authenticated user from context

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user || !user.userId) {
        setError("Please log in to view your profile");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch customer data
        const customerResponse = await axios.get(
          `http://localhost:8080/auth/customer/getcustomer/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const customerData = customerResponse.data;

        // Fetch profile image
        const imageResponse = await axios.get(
          `http://localhost:8080/auth/customer/getcustomer/${user.userId}/profileImage`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        // Fetch booking history
        const bookingsResponse = await axios.get(
          `http://localhost:8080/auth/bookings/getallcustomerbookings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        const customerProfile = {
          id: customerData.customerId,
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          avatar: imageResponse.data || `https://ui-avatars.com/api/?name=${customerData.name}&background=0A0A0A&color=fff&size=128`,
          stats: {
            totalTrips: bookingsResponse.data.length,
            totalSpent: bookingsResponse.data
              .reduce((sum, booking) => sum + parseFloat(booking.totalAmount || 0), 0)
              .toFixed(2),
            avgRating: bookingsResponse.data.length > 0
              ? (bookingsResponse.data.reduce((sum, booking) => sum + (booking.passengerRating || 0), 0) / bookingsResponse.data.length).toFixed(1)
              : 0,
            lastRide: bookingsResponse.data.length > 0
              ? new Date(bookingsResponse.data[0].pickupDate).toLocaleDateString()
              : "N/A",
          },
        };

        setCustomer(customerProfile);

        setBookingHistory(bookingsResponse.data.map(booking => ({
          id: booking.bookingId,
          date: booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : "N/A",
          from: booking.pickupLocation || "Unknown",
          to: booking.destination || "Unknown",
          amount: `Rs. ${parseFloat(booking.totalAmount || 0).toFixed(2)}`,
          status: booking.status || "Unknown",
          driver: booking.driverId ? "Assigned" : "N/A",
          rating: booking.passengerRating || null,
        })));

      } catch (err) {
        setError("Failed to load customer data: " + (err.response?.data || err.message));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user]);

  const handleCancelClick = (booking) => {
    // Only allow cancellation for non-completed and non-cancelled bookings
    if (booking.status !== "COMPLETED" && booking.status !== "CANCELLED") {
      setSelectedBooking(booking);
      setShowCancelModal(true);
      setCancellationReason("");
      setCancelError(null);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancellationReason.trim()) {
      setCancelError("Please provide a reason for cancellation");
      return;
    }
  
    setCancelLoading(true);
    setCancelError(null);
  
    try {
      await axios.post(
        `http://localhost:8080/auth/bookings/${selectedBooking.id}/cancel`,
        {
          reason: cancellationReason,
          bookingId: selectedBooking.id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json"
          },
        }
      );
  
      // Update the booking status in local state
      setBookingHistory(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, status: "CANCELLED" } 
            : booking
        )
      );
  
      // Close the modal
      setShowCancelModal(false);
      
      // Optional: Show success notification
      alert("Booking cancelled successfully");
      
    } catch (err) {
      setCancelError("Failed to cancel booking: " + (err.response?.data || err.message));
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center p-8 text-red-600">Please log in to view your profile</div>;
  }

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error || !customer) {
    return <div className="text-center p-8 text-red-600">{error || "Customer not found"}</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-yellow-600" />
          Customer Profile
        </h1>
        <div className="flex gap-3">
          <Link to="/editProfile">
            <button className="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors rounded-lg text-sm font-medium shadow-md">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-gray-900 border border-yellow-200 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl blur-xl opacity-30"></div>
            <img
              src={customer.avatar}
              alt={customer.name}
              className="relative w-28 h-28 rounded-2xl border-4 border-yellow-500/50 object-cover shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 w-6 h-6 rounded-full border-3 border-gray-100 shadow"></div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {customer.name}
                </h1>
                <p className="text-gray-600 text-sm mt-1 font-medium">
                  Customer ID: {customer.id}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { icon: <MailIcon />, label: "Email", value: customer.email },
                { icon: <PhoneIcon />, label: "Phone", value: customer.phone },
                { icon: <MapPinIcon />, label: "Address", value: customer.address },
                { icon: <ClockIcon />, label: "Last Activity", value: customer.stats.lastRide },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500 rounded-lg border border-yellow-600 shadow-sm">
                    {cloneElement(item.icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium">{item.label}</p>
                    <p className="text-gray-900 text-sm font-semibold">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Total Trips", value: customer.stats.totalTrips, icon: <CalendarCheckIcon /> },
          { title: "Total Spent", value: `Rs. ${customer.stats.totalSpent}`, icon: <DollarSignIcon /> },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-yellow-50 rounded-2xl p-6 border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-xs uppercase tracking-wider font-medium">
                {stat.title}
              </p>
              <div className="p-2 bg-yellow-500 rounded-lg border border-yellow-600 shadow-sm">
                {cloneElement(stat.icon, { className: "w-5 h-5 text-white" })}
              </div>
            </div>
            <p className="text-2xl font-bold mt-3 text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-yellow-50 rounded-2xl p-6 border border-yellow-200 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg border border-yellow-600 shadow-sm">
              <CalendarCheckIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Booking History
            </h2>
          </div>
          <button className="text-sm text-yellow-700 hover:text-yellow-800 font-semibold transition-colors flex items-center gap-1">
            View all <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-600 text-xs uppercase tracking-wider border-b border-yellow-200">
                <th className="text-left pb-4 font-semibold">Booking ID</th>
                <th className="text-left pb-4 font-semibold">Date</th>
                <th className="text-left pb-4 font-semibold">From</th>
                <th className="text-left pb-4 font-semibold">To</th>
                <th className="text-left pb-4 font-semibold">Driver</th>
                <th className="text-left pb-4 font-semibold">Status</th>
                <th className="text-right pb-4 font-semibold">Amount</th>
                <th className="text-center pb-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingHistory.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-yellow-100 hover:bg-yellow-50/50 transition-colors"
                >
                  <td className="py-4 text-sm font-semibold text-gray-900">
                    {booking.id}
                  </td>
                  <td className="py-4 text-sm text-gray-700">{booking.date}</td>
                  <td className="py-4 text-sm text-gray-700 max-w-[150px] truncate">
                    {booking.from}
                  </td>
                  <td className="py-4 text-sm text-gray-700 max-w-[150px] truncate">
                    {booking.to}
                  </td>
                  <td className="py-4 text-sm text-gray-700">
                    {booking.driver}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="py-4 text-right text-sm font-semibold text-gray-900">
                    {booking.amount}
                  </td>
                  <td className="py-4 text-center">
                    {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => handleCancelClick(booking)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors shadow-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">
              Please provide a reason for cancelling booking #{selectedBooking?.id}
            </p>
            <div className="mb-4">
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter cancellation reason"
                className="w-full border border-yellow-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={4}
              ></textarea>
              {cancelError && <p className="text-red-500 text-sm mt-1">{cancelError}</p>}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md disabled:opacity-50"
              >
                {cancelLoading ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let classes = "";
  switch (status) {
    case "COMPLETED":
      classes = "bg-green-100 text-green-700 border-green-300 shadow-sm";
      break;
    case "IN_PROGRESS":
      classes = "bg-yellow-100 text-yellow-700 border-yellow-300 shadow-sm";
      break;
    case "CANCELLED":
      classes = "bg-red-100 text-red-700 border-red-300 shadow-sm";
      break;
    default:
      classes = "bg-gray-100 text-gray-700 border-gray-300 shadow-sm";
  }
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${classes}`}
    >
      {status}
    </span>
  );
};

export default CustomerProfile;