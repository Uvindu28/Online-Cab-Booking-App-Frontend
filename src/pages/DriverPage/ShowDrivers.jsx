import { useState, useEffect } from 'react';
import axios from 'axios';

const ShowDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null); // Track which driver is being deleted

  const API_BASE_URL = 'http://localhost:8080/auth/driver';

  const getStatusColor = (availability) => {
    return availability ? 'bg-green-600' : 'bg-red-700';
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getalldrivers`);
        setDrivers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch drivers');
        setLoading(false);
        console.error('Error fetching drivers:', err);
      }
    };

    fetchDrivers();
  }, []);

  const handleViewClick = (driverId) => {
    console.log(`View driver with ID: ${driverId}`);
  };

  const handleDeleteClick = async (driverId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this driver?')) {
      setDeleteLoading(driverId); // Show loading state for this driver
      try {
        await axios.delete(`${API_BASE_URL}/${driverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDrivers(drivers.filter((driver) => driver.driverId !== driverId));
        setError(null); // Clear any previous errors
      } catch (err) {
        const errorMessage = err.response?.data || 'Failed to delete driver';
        setError(errorMessage);
        console.error('Error deleting driver:', err);
      } finally {
        setDeleteLoading(null); // Reset loading state
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div>Loading drivers...</div>
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
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-black">
          <span className="mr-2">🚗</span> Drivers Management
        </h2>
        <div className="bg-[#071013] rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700 text-gray-400">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">License</th>
                <th className="p-4">Status</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.driverId} className="border-t border-gray-700 text-white">
                  <td className="p-4">{driver.driverId}</td>
                  <td className="p-4">{driver.driverName}</td>
                  <td className="p-4">{driver.driverLicense}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white ${getStatusColor(
                        driver.availability
                      )}`}
                    >
                      {driver.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-4">
                    {driver.hasOwnCar && driver.car ? driver.car.model : 'No Vehicle'}
                  </td>
                  <td className="p-4">{driver.phone}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleViewClick(driver.driverId)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteClick(driver.driverId)}
                      disabled={deleteLoading === driver.driverId}
                      className={`text-white px-3 py-1 rounded-full transition-colors ${
                        deleteLoading === driver.driverId
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {deleteLoading === driver.driverId ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowDrivers;