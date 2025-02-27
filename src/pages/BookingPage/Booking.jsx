import { useEffect, useState } from "react";
import { CheckCircle, XCircle, MapPin, Filter } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CabSelection = () => {
  const [selectedCab, setSelectedCab] = useState(null);
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({ category: "", available: "", location: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCars();
  }, []);

  const fetchAllCars = async () => {
    try {
      const response = await axios.get("http://localhost:8080/all/getallCars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars", error.response || error.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredCars = cars.filter((car) => {
    return (
      (filters.category === "" || car.category === filters.category) &&
      (filters.available === "" || (filters.available === "true" && car.available) || (filters.available === "false" && !car.available)) &&
      (filters.location === "" || car.location === filters.location)
    );
  });

  const handleBookNow = (car) => {
    if (String(car.available).toLowerCase() === "true") {
      setSelectedCab(car);
      navigate("/billing", { state: { car } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Select Your Cab</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-500 w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
        </div>

        <select name="category" value={filters.category} onChange={handleFilterChange} className="border p-2 rounded-md">
          <option value="">All Categories</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Electric">Electric</option>
        </select>

        <select name="available" value={filters.available} onChange={handleFilterChange} className="border p-2 rounded-md">
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        <select name="location" value={filters.location} onChange={handleFilterChange} className="border p-2 rounded-md">
          <option value="">All Locations</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car.carId} className="bg-white p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 flex flex-col items-center border border-gray-200">
              <img src={car.carImageUrl} alt={car.model} className="w-40 h-24 object-cover rounded-md mb-4 shadow-sm" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{car.model}</h3>
              <p className="text-gray-600">Category: {car.category}</p>
              <p className="text-gray-600">Seats: {car.numberOfSeats}</p>
              <p className="text-gray-600 flex items-center"> <MapPin className="w-4 h-4 mr-1 text-gray-500" /> {car.location}</p>
              <p className={`text-lg font-medium mt-2 flex items-center ${car.available ? "text-green-500" : "text-red-500"}`}>
                {car.available ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                {car.available ? "Available" : "Not Available"}
              </p>
              <button
                disabled={!car.available}
                onClick={() => handleBookNow(car)}
                className={`px-6 py-3 mt-4 text-white font-semibold rounded-md transition-all shadow-md ${
                  car.available ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {car.available ? "Book Now" : "Unavailable"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-600 col-span-full">No cars found with selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default CabSelection;
