import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const BillingPage = () => {
  const location = useLocation();
  const { car } = location.state || {}; // Get car details from navigation
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isPaid, setIsPaid] = useState(false);
  const [pickupDateTime, setPickupDateTime] = useState(new Date()); // State for date & time
  const [assignedDriver, setAssignedDriver] = useState(null); // State for assigned driver

  if (!car) {
    return <div className="text-center text-red-500">No cab selected!</div>;
  }

  const rideDetails = {
    cabModel: car.model,
    licensePlate: car.licensePlate,
    seats: car.numberOfSeats,
    pickup: "Colombo City Center",
    dropoff: "Bandaranaike Airport",
    baseFare: 5.0,
    distanceFare: 15.0,
    tax: 2.5,
    total: 22.5,
  };

  const handlePayment = async () => {
    if (!pickupDateTime) {
      alert("Please select a pickup date and time before proceeding.");
      return;
    }

    // Create a booking object
    const bookingData = {
      carId: car.carId,
      pickupLocation: rideDetails.pickup,
      dropoffLocation: rideDetails.dropoff,
      pickupDateTime: pickupDateTime.toISOString(), // Convert to ISO string
      paymentMethod: paymentMethod,
      totalAmount: rideDetails.total,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/booking/createbooking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (response.ok) {
        const bookingResponse = await response.json();
        setIsPaid(true);
        alert("Payment Successful! Your ride has been confirmed.");
        // Set driver details after booking is created
        setAssignedDriver(bookingResponse.assignedDriver);
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6 mt-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Billing & Payment
        </h2>

        {/* Ride Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ride Details
          </h3>
          <p className="text-gray-600">
            <strong>Cab:</strong> {rideDetails.cabModel} (
            {rideDetails.licensePlate})
          </p>
          <p className="text-gray-600">
            <strong>Seats:</strong> {rideDetails.seats}
          </p>
          <p className="text-gray-600">
            <strong>Pickup:</strong> {rideDetails.pickup}
          </p>
          <p className="text-gray-600">
            <strong>Dropoff:</strong> {rideDetails.dropoff}
          </p>
          <p className="text-gray-600">
            <strong>Pickup Date & Time:</strong>{" "}
            {pickupDateTime.toLocaleString()}
          </p>
        </div>

        {/* Pickup Date & Time Selection */}
        <div className="mb-6">
          <label className="block text-gray-900 font-semibold mb-2">
            Select Pickup Date & Time
          </label>
          <DateTimePicker
            onChange={setPickupDateTime}
            value={pickupDateTime}
            format="y-MM-dd h:mm a"
            disableClock={true}
            minDate={new Date()}
            clearIcon={null} // Remove cross button
            calendarIcon={
              <svg
                className="w-6 h-6 text-emerald-500 hover:text-emerald-600 transition"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10m-5-5h10M3 21h18M5 11V3h14v8M5 21V11M19 21V11"
                ></path>
              </svg>
            }
            className="w-full bg-transparent text-lg font-semibold text-gray-700
              "
          />
        </div>

        {/* Price Breakdown */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Price Breakdown
          </h3>
          <div className="text-gray-600">
            <p>
              Base Fare:{" "}
              <span className="float-right">
                ${rideDetails.baseFare.toFixed(2)}
              </span>
            </p>
            <p>
              Distance Fare:{" "}
              <span className="float-right">
                ${rideDetails.distanceFare.toFixed(2)}
              </span>
            </p>
            <p>
              Tax:{" "}
              <span className="float-right">${rideDetails.tax.toFixed(2)}</span>
            </p>
          </div>
          <hr className="my-3" />
          <p className="text-xl font-bold text-gray-900">
            Total:{" "}
            <span className="float-right">${rideDetails.total.toFixed(2)}</span>
          </p>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-emerald-500 text-white py-3 rounded-md font-semibold hover:bg-emerald-600 transition-all"
        >
          Confirm Payment
        </button>

        {/* Assigned Driver Information */}
        {assignedDriver && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Assigned Driver
            </h3>
            <p className="text-gray-600">
              <strong>Name:</strong> {assignedDriver.name}
            </p>
            <p className="text-gray-600">
              <strong>Car Model:</strong> {assignedDriver.carModel}
            </p>
          </div>
        )}

        {/* Payment Success Message */}
        {isPaid && (
          <div className="mt-6 flex items-center justify-center text-emerald-500 font-semibold text-lg">
            <CheckCircle className="w-6 h-6 mr-2" />
            Payment Successful!
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
