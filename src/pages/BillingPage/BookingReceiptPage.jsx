import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../../components/Header.jsx";
import { useAuth } from "../../utils/AuthContext.jsx";

const BookingReceiptPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const generateBookingReference = () => {
    return `BK-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (bookingDetails) {
      setBooking(bookingDetails);
    } else {
      setError("Booking details not found");
    }
  }, [bookingDetails]);

  const handleBackToDashboard = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600">Loading receipt...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="mb-6">{error}</p>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const mockBooking = {
    bookingId: 12345,
    reference: generateBookingReference(),
    date: new Date().toISOString(),
    pickupLocation: "Colombo City Center",
    destination: "Bandaranaike Airport",
    pickupDate: "2025-03-25",
    pickupTime: "14:30",
    carModel: "Toyota Camry",
    licensePlate: "CBF-3421",
    totalAmount: 4500.0,
    driverRequired: true,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card"
  };

  const bookingData = booking || mockBooking;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-16 px-4 max-w-4xl mt-15">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-indigo-600 p-6 text-white print:bg-gray-800">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Booking Receipt</h1>
              <div className="text-sm">
                <p>Date: {formatDate(bookingData.date)}</p>
                <p>Reference: {bookingData.reference}</p>
              </div>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="p-8">
            {/* Customer Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Name:</p>
                  <p className="font-medium">{user?.username || "Guest Customer"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Booking ID:</p>
                  <p className="font-medium">#{bookingData.bookingId}</p>
                </div>
              </div>
            </div>

            {/* Ride Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ride Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Pickup Location:</p>
                  <p className="font-medium">{bookingData.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-gray-600">Destination:</p>
                  <p className="font-medium">{bookingData.destination}</p>
                </div>
                <div>
                  <p className="text-gray-600">Pickup Date:</p>
                  <p className="font-medium">{formatDate(bookingData.pickupDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Pickup Time:</p>
                  <p className="font-medium">{bookingData.pickupTime}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Car Model:</p>
                  <p className="font-medium">{bookingData.carModel}</p>
                </div>
                <div>
                  <p className="text-gray-600">License Plate:</p>
                  <p className="font-medium">{bookingData.licensePlate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Driver Required:</p>
                  <p className="font-medium">{bookingData.driverRequired ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Payment Status:</p>
                  <p className="font-medium text-green-600">{bookingData.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Method:</p>
                  <p className="font-medium">{bookingData.paymentMethod}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="font-bold text-xl text-gray-900">LKR {bookingData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-8 text-sm text-gray-500 border-t pt-4">
              <p className="mb-2">
                <strong>Terms and Conditions:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Cancellations must be made at least 2 hours before pickup time for a full refund.</li>
                <li>The driver will wait for a maximum of 15 minutes past the scheduled pickup time.</li>
                <li>Additional charges may apply for waiting time beyond 15 minutes.</li>
                <li>For support, contact our customer service at support@example.com.</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-4 print:hidden">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center ml-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReceiptPage;