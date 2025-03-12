import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }) => (
  <div className="p-4 text-red-600">
    <p>Something went wrong displaying vehicles:</p>
    <pre>{error.message}</pre>
  </div>
);

const AdminVehiclesPage = () => {
  const [vehiclesData, setVehiclesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:8080/all/getallcars', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehiclesData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (available) => {
    return available ? 'bg-green-600' : 'bg-red-700';
  };

  const handleViewClick = async (carId) => {
    try {
      const response = await fetch(`http://localhost:8080/all/getcarbyid/${carId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const carData = await response.json();
      console.log('Vehicle details:', carData);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    }
  };

  const handleDeleteClick = async (carId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await fetch(`http://localhost:8080/auth/cars/deletecar/${carId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white p-6">Loading...</div>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-black">
            <span className="mr-2">🚙</span> Vehicles Management
          </h2>
          <div className="bg-[#071013] rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-700 text-gray-400">
                  <th className="p-4">ID</th>
                  <th className="p-4">Model</th>
                  <th className="p-4">License Plate</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Driver ID</th>
                  <th className="p-4">Base Rate</th>
                  <th className="p-4">Driver Rate</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehiclesData.map((vehicle) => (
                  <tr key={vehicle.carId} className="border-t border-gray-700 text-white">
                    <td className="p-4">{vehicle.carId}</td>
                    <td className="p-4">{vehicle.model}</td>
                    <td className="p-4">{vehicle.licensePlate}</td>
                    <td className="p-4">{vehicle.numberOfSeats}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-white ${getStatusColor(
                          vehicle.available
                        )}`}
                      >
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-4">{vehicle.assignedDriverId || 'None'}</td>
                    <td className="p-4">
                      ${vehicle.baseRate !== undefined ? vehicle.baseRate.toFixed(2) : 'N/A'}
                    </td>
                    <td className="p-4">
                      ${vehicle.driverRate !== undefined ? vehicle.driverRate.toFixed(2) : 'N/A'}
                    </td>
                    <td className="p-4">{vehicle.categoryId}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleViewClick(vehicle.carId)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteClick(vehicle.carId)}
                        className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminVehiclesPage;