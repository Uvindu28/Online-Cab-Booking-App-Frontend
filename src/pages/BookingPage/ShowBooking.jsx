import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext'; // Adjust the import path based on your file structure

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, logout } = useAuth(); // Get user and logout from AuthContext
  const API_URL = 'http://localhost:8080/auth/bookings'; // Adjust this URL as needed

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-600';
      case 'IN_PROGRESS':
        return 'bg-yellow-600';
      case 'CANCELLED':
        return 'bg-red-700';
      default:
        return 'bg-gray-600';
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setError('Please log in to view bookings');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('jwtToken'); // Still needed for API calls
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          logout(); // Logout if token is missing
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${API_URL}/getallbookings`, config);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          logout();
        } else {
          setError('Failed to fetch bookings');
        }
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookings();
  }, [user, logout]); // Add user and logout as dependencies

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div>Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-black">
          <span className="mr-2">⏰</span> Recent Bookings
        </h2>
        <div className="bg-[#071013] rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700 text-gray-400">
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId} className="border-t border-gray-700 text-white">
                  <td className="p-4">{booking.bookingId}</td>
                  <td className="p-4">
                    {booking.customer 
                      ? `${booking.customer.name}`
                      : 'Unknown Customer'}
                  </td>
                  <td className="p-4">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">${booking.amount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;