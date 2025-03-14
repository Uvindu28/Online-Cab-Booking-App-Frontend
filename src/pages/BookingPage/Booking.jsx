import { useEffect, useState } from "react";
import { MapPin, Filter, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
const CabSelection = () => {
  const [selectedCab, setSelectedCab] = useState(null);
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    available: "",
    location: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    fetchAllCars();
  }, []);
  const fetchAllCars = async () => {
    try {
      const response = await axios.get("http://localhost:8080/all/getallcars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars", error.response || error.message);
    }
  };
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  const filteredCars = cars.filter((car) => {
    return (
      (filters.category === "" || car.category === filters.category) &&
      (filters.available === "" ||
        (filters.available === "true" && car.available) ||
        (filters.available === "false" && !car.available))
    );
  });
  const handleBookNow = (car) => {
    if (String(car.available).toLowerCase() === "true") {
      setSelectedCab(car);
      navigate("/billing", {
        state: {
          car,
        },
      });
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <div className="relative pt-20 pb-8 px-4 mt-15">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            Find Your Perfect Ride
          </h1>
          <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto">
            Choose from our wide selection of premium vehicles for your journey
          </p>
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Where would you like to go?"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Filters Section */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center space-x-2">
              <Filter className="text-yellow-500 w-4 h-4" />
              <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
            </div>
            {["category", "available"].map((filterType) => (
              <select
                key={filterType}
                name={filterType}
                value={filters[filterType]}
                onChange={handleFilterChange}
                className="bg-white border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all min-w-[140px] text-sm"
              >
                <option value="">{`All ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}s`}</option>
                {filterType === "category" &&
                  ["SEDAN", "SUV", "ELECTRIC"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                {filterType === "available" &&
                  ["true", "false"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "true" ? "Available" : "Not Available"}
                    </option>
                  ))}
              </select>
            ))}
          </div>
        </div>
      </div>
      {/* Cars Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div
                key={car.carId}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-yellow-200"
              >
                <div className="relative">
                  <img
                    src={car.carImageUrl}
                    alt={car.model}
                    className="w-full h-32 object-cover rounded-t-xl"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${car.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {car.available ? "Available" : "Booked"}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {car.model}
                  </h3>
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-gray-600 flex items-center justify-between">
                      <span>Category:</span>
                      <span className="font-medium text-gray-900">
                        {car.category}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-center justify-between">
                      <span>Seats:</span>
                      <span className="font-medium text-gray-900">
                        {car.numberOfSeats}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-yellow-500" />
                      <span className="font-medium text-gray-900">
                        {car.location}
                      </span>
                    </p>
                  </div>
                  <button
                    disabled={!car.available}
                    onClick={() => handleBookNow(car)}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${car.available ? "bg-black text-white hover:bg-gray-800" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  >
                    {car.available ? "Book Now" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">
                No cars found with selected filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CabSelection;
