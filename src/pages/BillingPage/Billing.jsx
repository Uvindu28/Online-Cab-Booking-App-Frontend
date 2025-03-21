import { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { LoadScript, Autocomplete, GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../components/Header.jsx";
import { useAuth } from "../../utils/AuthContext.jsx";
import toast from "react-hot-toast";

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
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getSriLankanTime = () => {
  const now = new Date();
  const offset = 5.5 * 60;
  return new Date(now.getTime() + offset * 60 * 1000);
};

const getSriLankanTimeFormatted = () => {
  const sriLankanTime = getSriLankanTime();
  const hours = sriLankanTime.getUTCHours().toString().padStart(2, "0");
  const minutes = sriLankanTime.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const BillingPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};

  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [pickupDate, setPickupDate] = useState(getSriLankanTime());
  const [pickupTime, setPickupTime] = useState({
    hours: getSriLankanTimeFormatted().split(":")[0],
    minutes: getSriLankanTimeFormatted().split(":")[1],
  });
  const [driverAssigned, setDriverAssigned] = useState(false);
  const [pickupSearch, setPickupSearch] = useState("Colombo City Center");
  const [dropoffSearch, setDropoffSearch] = useState("Bandaranaike Airport");
  const [driverRequired, setDriverRequired] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [rideDetails, setRideDetails] = useState({
    cabModel: "",
    licensePlate: "",
    seats: 0,
    pickup: "Colombo City Center",
    dropoff: "Bandaranaike Airport",
    baseFare: car ? car.baseRate : 1500, // Use baseRate from car object
    distanceFare: 0,
    tax: 25,     // Tax in LKR
    total: 0,
    pickupCoords: [6.9271, 79.8612],
    dropoffCoords: [7.1806, 79.8846],
    distance: 0,
  });
  const [directions, setDirections] = useState(null);

  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);
  const mapRef = useRef(null);
  
  // Redirect timer for receipt page
  const [redirectTimer, setRedirectTimer] = useState(null);

  useEffect(() => {
    if (car) {
      setRideDetails((prev) => ({
        ...prev,
        cabModel: car.model,
        licensePlate: car.licensePlate,
        seats: car.numberOfSeats,
        baseFare: car.baseRate, // Set baseFare from car object
      }));
    }
  }, [car]);

  useEffect(() => {
    if (rideDetails.pickupCoords && rideDetails.dropoffCoords && window.google?.maps) {
      const distance = getDistance(rideDetails.pickupCoords, rideDetails.dropoffCoords);
      const distanceFareLKR = distance * 35; // 450 LKR per km
      setRideDetails((prev) => ({
        ...prev,
        distance,
        distanceFare: distanceFareLKR,
        total: prev.baseFare + distanceFareLKR + prev.tax,
      }));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: rideDetails.pickupCoords[0], lng: rideDetails.pickupCoords[1] },
          destination: { lat: rideDetails.dropoffCoords[0], lng: rideDetails.dropoffCoords[1] },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed due to ${status}`);
            setError("Failed to load route. Please try again.");
          }
        }
      );
    }
  }, [rideDetails.pickupCoords, rideDetails.dropoffCoords]);

  // Handle redirect to receipt page
  useEffect(() => {
    if (isPaid && bookingResponse) {
      const timer = setTimeout(() => {
        const formattedPickupDate = pickupDate.toISOString().split("T")[0];
        const formattedPickupTime = `${pickupTime.hours}:${pickupTime.minutes}`;
        
        // Prepare booking details for receipt page
        const bookingDetails = {
          bookingId: bookingResponse.bookingId || Math.floor(10000 + Math.random() * 90000),
          reference: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toISOString(),
          pickupLocation: rideDetails.pickup,
          destination: rideDetails.dropoff,
          pickupDate: formattedPickupDate,
          pickupTime: formattedPickupTime,
          carModel: rideDetails.cabModel,
          licensePlate: rideDetails.licensePlate,
          totalAmount: rideDetails.total,
          driverRequired,
          paymentStatus: "Paid",
          paymentMethod: "Credit Card"
        };
        
        navigate("/receipt", { state: { bookingDetails } });
      }, 3000); // Redirect after 3 seconds
      
      setRedirectTimer(timer);
      
      return () => {
        if (redirectTimer) clearTimeout(redirectTimer);
      };
    }
  }, [isPaid, bookingResponse, navigate, rideDetails, pickupDate, pickupTime, driverRequired]);

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
    if (!pickupDate || !pickupTime.hours || !pickupTime.minutes) {
      setError("Please select both a pickup date and time.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const formattedDate = pickupDate.toISOString().split("T")[0];
    const formattedTime = `${pickupTime.hours}:${pickupTime.minutes}`;

    const bookingData = {
      carId: car.carId,
      pickupLocation: rideDetails.pickup,
      destination: rideDetails.dropoff,
      pickupDate: formattedDate,
      pickupTime: formattedTime,
      totalAmount: rideDetails.total, // Total in LKR
      driverRequired: driverRequired,
    };

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch("http://localhost:8080/auth/bookings/createbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to create a booking. Contact support.");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Payment processing failed");
        }
      }

      const responseData = await response.json();
      setBookingResponse(responseData);

      // Just check if a driver was assigned without fetching details
      if (driverRequired && responseData.driverId) {
        setDriverAssigned(true);
      }

      setIsPaid(true);
      toast.success("Payment Successful! Your ride has been confirmed. Redirecting to receipt...");
    } catch (error) {
      setError(`Payment failed: ${error.message}`);
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // View Receipt Button Handler
  const handleViewReceipt = () => {
    if (isPaid && bookingResponse) {
      const formattedPickupDate = pickupDate.toISOString().split("T")[0];
      const formattedPickupTime = `${pickupTime.hours}:${pickupTime.minutes}`;
      
      const bookingDetails = {
        bookingId: bookingResponse.bookingId || Math.floor(10000 + Math.random() * 90000),
        reference: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        pickupLocation: rideDetails.pickup,
        destination: rideDetails.dropoff,
        pickupDate: formattedPickupDate,
        pickupTime: formattedPickupTime,
        carModel: rideDetails.cabModel,
        licensePlate: rideDetails.licensePlate,
        totalAmount: rideDetails.total,
        driverRequired,
        paymentStatus: "Paid",
        paymentMethod: "Credit Card"
      };
      
      navigate("/receipt", { state: { bookingDetails } });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <p className="text-xl font-medium text-red-600">Please log in to book a ride.</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <p className="text-xl font-medium text-red-600">No cab selected.</p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<div className="text-center py-10 text-gray-500">Loading Google Maps...</div>}
      onError={() =>
        setError("Failed to load Google Maps. Please check your network or disable ad blockers.")
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 mt-15">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-10 tracking-tight">
              Billing & Confirmation
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-pulse">
                {error}
              </div>
            )}

            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-gray-700 text-sm">
                Booking as: <span className="font-semibold text-indigo-600">{user.username}</span>
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Section */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Trip Details</h3>
                  <div className="grid grid-cols-1 gap-6">
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
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
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
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
                          placeholder="Enter dropoff location"
                        />
                      </Autocomplete>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Ride Information</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-medium">Cab:</span> {rideDetails.cabModel} (
                      {rideDetails.licensePlate})
                    </p>
                    <p>
                      <span className="font-medium">Seats:</span> {rideDetails.seats}
                    </p>
                    <p>
                      <span className="font-medium">Pickup:</span> {rideDetails.pickup}
                    </p>
                    <p>
                      <span className="font-medium">Dropoff:</span> {rideDetails.dropoff}
                    </p>
                    <p>
                      <span className="font-medium">Distance:</span>{" "}
                      {rideDetails.distance.toFixed(2)} km
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Schedule & Payment</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Date (Sri Lanka Time)
                      </label>
                      <DatePicker
                        selected={pickupDate}
                        onChange={(date) => setPickupDate(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={getSriLankanTime()}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Time (Sri Lanka Time)
                      </label>
                      <div className="flex space-x-3">
                        <select
                          value={pickupTime.hours}
                          onChange={(e) =>
                            setPickupTime((prev) => ({ ...prev, hours: e.target.value }))
                          }
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
                        >
                          {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map(
                            (hour) => (
                              <option key={hour} value={hour}>
                                {hour}
                              </option>
                            )
                          )}
                        </select>
                        <select
                          value={pickupTime.minutes}
                          onChange={(e) =>
                            setPickupTime((prev) => ({ ...prev, minutes: e.target.value }))
                          }
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
                        >
                          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(
                            (minute) => (
                              <option key={minute} value={minute}>
                                {minute}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Price Breakdown</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex justify-between">
                      <span>Base Fare</span>
                      <span className="font-medium">LKR {rideDetails.baseFare.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Distance Fare ({rideDetails.distance.toFixed(2)} km)</span>
                      <span className="font-medium">LKR {rideDetails.distanceFare.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Tax</span>
                      <span className="font-medium">LKR {rideDetails.tax.toFixed(2)}</span>
                    </p>
                    <hr className="my-3 border-gray-200" />
                    <p className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>LKR {rideDetails.total.toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={driverRequired}
                      onChange={(e) => setDriverRequired(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-400"
                    />
                    <span className="text-gray-700 font-medium">Require a driver?</span>
                  </label>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl font-semibold text-lg shadow-md transition-all duration-300 ${
                    isProcessing
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:from-indigo-700 hover:to-indigo-900 hover:shadow-lg"
                  }`}
                >
                  {isProcessing ? "Processing Payment..." : "Confirm & Pay"}
                </button>

                {isPaid && (
                  <div className="flex items-center justify-center text-green-600 font-semibold text-lg animate-bounce">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Payment Confirmed Successfully!
                    {driverRequired && driverAssigned && (
                      <span className="ml-2">A driver has been assigned to your booking.</span>
                    )}
                  </div>
                )}
                
                {isPaid && (
                  <button
                    onClick={handleViewReceipt}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-semibold text-lg shadow-md transition-all duration-300 hover:from-green-700 hover:to-green-900 hover:shadow-lg"
                  >
                    View Receipt
                  </button>
                )}
              </div>

              {/* Right Section */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Route Preview</h3>
                  <GoogleMap
                    mapContainerClassName="h-[600px] w-full rounded-xl shadow-md border border-gray-200"
                    center={{ lat: rideDetails.pickupCoords[0], lng: rideDetails.pickupCoords[1] }}
                    zoom={10}
                    onLoad={(map) => (mapRef.current = map)}
                  >
                    {directions && <DirectionsRenderer directions={directions} />}
                  </GoogleMap>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default BillingPage;