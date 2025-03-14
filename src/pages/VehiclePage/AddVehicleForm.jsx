import { useState } from 'react';
import { useAuth } from '../../utils/AuthContext'; // Import the useAuth hook

const AddVehicleForm = ({ onClose, onSubmit }) => {
  const { user } = useAuth(); // Get the authenticated user
  const [formData, setFormData] = useState({
    model: '',
    licensePlate: '',
    numberOfSeats: '',
    baseRate: '',
    driverRate: '',
    category: '',
    carImage: null, // For file upload
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      carImage: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if the user is authenticated
    if (!user) {
      setError('You must be logged in to add a vehicle.');
      setLoading(false);
      return;
    }

    // Prepare FormData for the request
    const formDataToSend = new FormData();
    formDataToSend.append('licensePlate', formData.licensePlate);
    formDataToSend.append('model', formData.model);
    formDataToSend.append('numberOfSeats', formData.numberOfSeats);
    formDataToSend.append('baseRate', formData.baseRate);
    formDataToSend.append('driverRate', formData.driverRate);
    formDataToSend.append('categoryId', formData.category);
    formDataToSend.append('carImage', formData.carImage);

    try {
      const token = localStorage.getItem('jwtToken'); // Get the JWT token
      if (!token) {
        throw new Error('User is not authenticated');
      }

      // Send the request to the backend
      const response = await fetch('http://localhost:8080/auth/cars/createcar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the headers
        },
        body: formDataToSend, // Use FormData for file upload
      });

      if (!response.ok) {
        throw new Error('Failed to create car');
      }

      const savedCar = await response.json();
      onSubmit(savedCar); // Pass the saved car data to the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating car:', error);
      setError('Failed to create car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-black p-6 rounded-lg w-1/3 border-2 border-yellow-500">
        <h3 className="text-xl font-bold mb-4 text-yellow-500">Add New Vehicle</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="model"
              placeholder="Model"
              className="w-full p-2 border border-yellow-500 rounded bg-black text-yellow-500 placeholder-yellow-500"
              value={formData.model}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="licensePlate"
              placeholder="License Plate"
              className="w-full p-2 border border-yellow-500 rounded bg-black text-yellow-500 placeholder-yellow-500"
              value={formData.licensePlate}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="numberOfSeats"
              placeholder="Number of Seats"
              className="w-full p-2 border border-yellow-500 rounded bg-black text-yellow-500 placeholder-yellow-500"
              value={formData.numberOfSeats}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="baseRate"
              placeholder="Base Rate"
              className="w-full p-2 border border-yellow-500 rounded bg-black text-yellow-500 placeholder-yellow-500"
              value={formData.baseRate}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="driverRate"
              placeholder="Driver Rate"
              className="w-full p-2 border border-yellow-500 rounded bg-black text-yellow-500 placeholder-yellow-500"
              value={formData.driverRate}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="w-full p-2 border border-yellow-500 rounded bg-black text-yellow-500 placeholder-yellow-500"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="carImage"
              accept="image/*"
              className="w-full p-2 border border-yellow-500 rounded bg-black text-yellow-500"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleForm;