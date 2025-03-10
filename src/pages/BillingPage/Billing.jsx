import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "leaflet/dist/leaflet.css";
import Header from "../../components/Header.jsx";
import { useAuth } from "../../utils/AuthContext.jsx"; // Import the useAuth hook

const GOOGLE_MAPS_API_KEY = "AIzaSyAe8qybKlyLJc7fAC3s-0NwUApOPYRILCs";
const libraries = ["places"];

const COLOMBO_BOUNDS = {
  north: 6.98,
  south: 6.85,
  east: 79.92,
  west: 79.82,
};

const getDistance = (coords1, coords2) => {
  const R = 6371;
  const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
  const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const BillingPage = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const location = useLocation();
  const { car } = location.state || {};

  const [paymentMethod] = useState("credit-card");
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [pickupDateTime, setPickupDateTime] = useState(new Date());
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [pickupSearch, setPickupSearch] = useState("");
  const [dropoffSearch, setDropoffSearch] = useState("");
  const [rideDetails, setRideDetails] = useState({
    cabModel: "",
    licensePlate: "",
    seats: 0,
    pickup: "Colombo City Center",
    dropoff: "Bandaranaike Airport",
    baseFare: 5.0,
    distanceFare: 0,
    tax: 2.5,
    total: 0,
    pickupCoords: [6.9271, 79.8612],
    dropoffCoords: [7.1806, 79.8846],
    distance: 0,
  });

  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);

  useEffect(() => {
    if (car) {
      setRideDetails((prev) => ({
        ...prev,
        cabModel: car.model,
        licensePlate: car.licensePlate,
        seats: car.numberOfSeats,
      }));
    }
  }, [car]);

  useEffect(() => {
    if (rideDetails.pickupCoords && rideDetails.dropoffCoords) {
      const distance = getDistance(rideDetails.pickupCoords, rideDetails.dropoffCoords);
      setRideDetails(prev => ({
        ...prev,
        distance,
        distanceFare: distance * 1.5,
        total: prev.baseFare + (distance * 1.5) + prev.tax
      }));
    }
  }, [rideDetails.pickupCoords, rideDetails.dropoffCoords]);

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="text-center text-red-500 font-semibold py-10">
        Please log in to book a ride!
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center text-red-500 font-semibold py-10">
        No cab selected!
      </div>
    );
  }

  const onPlaceChanged = (type) => {
    const autocomplete = type === "pickup" ? pickupAutocomplete : dropoffAutocomplete;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const coords = [place.geometry.location.lat(), place.geometry.location.lng()];
        if (type === "pickup") {
          setRideDetails((prev) => ({
            ...prev,
            pickup: place.formatted_address || place.name,
            pickupCoords: coords,
          }));
          setPickupSearch(place.formatted_address || place.name);
        } else {
          setRideDetails((prev) => ({
            ...prev,
            dropoff: place.formatted_address || place.name,
            dropoffCoords: coords,
          }));
          setDropoffSearch(place.formatted_address || place.name);
        }
      } else {
        setError("Please select a valid location from the suggestions.");
      }
    }
  };

  const handlePayment = async () => {
    if (!pickupDateTime) {
      setError("Please select a pickup date and time.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const bookingData = {
      carId: car.carId,
      pickupLocation: rideDetails.pickup,
      dropoffLocation: rideDetails.dropoff,
      pickupDateTime: pickupDateTime.toISOString(),
      paymentMethod,
      totalAmount: rideDetails.total,
      customerId: user.userId, // Add customerId from authenticated user
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8080/auth/bookings/createbooking", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add JWT token to headers
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(await response.text() || "Payment processing failed");
      }

      const bookingResponse = await response.json();
      setIsPaid(true);
      setAssignedDriver(bookingResponse.assignedDriver);
      alert("Payment Successful! Your ride has been confirmed.");
    } catch (error) {
      setError(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-15">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
              Billing & Payment
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Booking as: <strong>{user.username}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <Autocomplete
                  onLoad={(autocomplete) => setPickupAutocomplete(autocomplete)}
                  onPlaceChanged={() => onPlaceChanged("pickup")}
                  options={{
                    bounds: COLOMBO_BOUNDS,
                    strictBounds: false,
                    types: ["geocode"],
                    componentRestrictions: { country: "lk" },
                  }}
                >
                  <input
                    type="text"
                    value={pickupSearch}
                    onChange={(e) => setPickupSearch(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter pickup location"
                  />
                </Autocomplete>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dropoff Location
                </label>
                <Autocomplete
                  onLoad={(autocomplete) => setDropoffAutocomplete(autocomplete)}
                  onPlaceChanged={() => onPlaceChanged("dropoff")}
                  options={{
                    bounds: COLOMBO_BOUNDS,
                    strictBounds: false,
                    types: ["geocode"],
                    componentRestrictions: { country: "lk" },
                  }}
                >
                  <input
                    type="text"
                    value={dropoffSearch}
                    onChange={(e) => setDropoffSearch(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter dropoff location"
                  />
                </Autocomplete>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Ride Details
              </h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Cab:</strong> {rideDetails.cabModel} ({rideDetails.licensePlate})</p>
                <p><strong>Seats:</strong> {rideDetails.seats}</p>
                <p><strong>Pickup:</strong> {rideDetails.pickup}</p>
                <p><strong>Dropoff:</strong> {rideDetails.dropoff}</p>
                <p><strong>Distance:</strong> {rideDetails.distance.toFixed(2)} km</p>
                <p><strong>Pickup Time:</strong> {pickupDateTime.toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Ride Route
              </h3>
              <MapContainer
                center={rideDetails.pickupCoords}
                zoom={10}
                className="h-72 w-full rounded-lg shadow-md"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={rideDetails.pickupCoords}>
                  <Popup>Pickup: {rideDetails.pickup}</Popup>
                </Marker>
                <Marker position={rideDetails.dropoffCoords}>
                  <Popup>Dropoff: {rideDetails.dropoff}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Pickup Date & Time
              </label>
              <DateTimePicker
                onChange={setPickupDateTime}
                value={pickupDateTime}
                format="y-MM-dd h:mm a"
                disableClock={true}
                minDate={new Date()}
                clearIcon={null}
                className="w-full bg-white border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Price Breakdown
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex justify-between">
                  <span>Base Fare:</span>
                  <span>${rideDetails.baseFare.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Distance Fare ({rideDetails.distance.toFixed(2)} km):</span>
                  <span>${rideDetails.distanceFare.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Tax:</span>
                  <span>${rideDetails.tax.toFixed(2)}</span>
                </p>
                <hr className="my-3 border-gray-200" />
                <p className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>${rideDetails.total.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </button>

            {assignedDriver && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Assigned Driver
                </h3>
                <p><strong>Name:</strong> {assignedDriver.name}</p>
                <p><strong>Car Model:</strong> {assignedDriver.carModel}</p>
              </div>
            )}

            {isPaid && (
              <div className="mt-8 flex items-center justify-center text-green-600 font-semibold text-lg">
                <CheckCircle className="w-6 h-6 mr-2" />
                Payment Successful!
              </div>
            )}
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default BillingPage;