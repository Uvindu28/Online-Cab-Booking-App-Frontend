import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCustomersPage = () => {
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for the API - adjust this according to your backend deployment
  const API_BASE_URL = 'http://localhost:8080/auth/customer';

  // Fetch all customers when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getallCustomers`);
        setCustomersData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customers');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewClick = async (customerId) => {
    try {
      // Fetch individual customer details
      const response = await axios.get(`${API_BASE_URL}/getcustomer/${customerId}`);
      console.log('Customer details:', response.data);
      // In a real app, you could:
      // 1. Navigate to a details page: history.push(`/customers/${customerId}`)
      // 2. Open a modal with customer details
      // 3. Store in state to display additional details
    } catch (err) {
      console.error('Error fetching customer:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p className="text-black">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-black">
          <span className="mr-2">👥</span> Customers Management
        </h2>
        <div className="bg-[#071013] rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700 text-gray-400">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer) => (
                <tr key={customer.id} className="border-t border-gray-700 text-white">
                  <td className="p-4">{customer.customerId}</td>
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.phone}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewClick(customer.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      View
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

export default AdminCustomersPage;