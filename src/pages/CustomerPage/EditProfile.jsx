import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext'; // Adjust path based on your file structure
import {
  CameraIcon,
  SaveIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
} from 'lucide-react';
import axios from 'axios';

const EditProfile = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customer data when component mounts
  useEffect(() => {
    if (user?.userId) {
      fetchCustomerData();
    }
  }, [user]);

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/auth/customer/getcustomer/${user.userId}`
      );
      const customer = response.data;
      setFormData({
        name: customer.name || '',
        address: customer.address || '',
        phone: customer.phone || '',
      });
      setProfileImage(customer.profileImage || '');
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('address', formData.address);
      updateData.append('phone', formData.phone);

      // If a new profile image is selected
      const fileInput = document.getElementById('profile-upload');
      if (fileInput.files[0]) {
        updateData.append('profileImage', fileInput.files[0]);
      }

      const response = await axios.put(
        `http://localhost:8080/auth/customer/updatecustomer/${user.userId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );

      // Update local state with the response
      const updatedCustomer = response.data;
      setFormData({
        name: updatedCustomer.name,
        address: updatedCustomer.address,
        phone: updatedCustomer.phone,
      });
      setProfileImage(updatedCustomer.profileImage || profileImage);

    } catch (err) {
      setError(err.response?.data || 'Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to edit your profile</div>;
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-yellow-400">
          <div className="px-4 py-5 sm:px-6 bg-yellow-400">
            <h1 className="text-2xl font-bold text-black">Edit Profile</h1>
            <p className="mt-1 text-sm text-black/80">
              Update your personal information and preferences.
            </p>
          </div>
          <div className="border-t border-yellow-400 px-4 py-5 sm:px-6">
            {error && (
              <div className="mb-4 text-red-600 text-sm">{error}</div>
            )}
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-black/5">
                  <img
                    src={profileImage || 'https://via.placeholder.com/128'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 text-black cursor-pointer shadow-md hover:bg-yellow-500 transition-colors"
                >
                  <CameraIcon size={20} />
                  <input
                    id="profile-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-sm text-black/70 mt-2">
                Click the camera icon to upload a new photo
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-black flex items-center">
                    <UserIcon size={20} className="mr-2 text-yellow-500" />
                    Personal Information
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-black"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-yellow-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-black flex items-center"
                      >
                        <MapPinIcon size={16} className="mr-1 text-gray-500" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-yellow-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-black flex items-center"
                      >
                        <PhoneIcon size={16} className="mr-1 text-gray-500" />
                        Phone number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-yellow-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="pt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-black rounded-md shadow-sm text-sm font-medium text-black hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                  disabled={loading}
                >
                  <SaveIcon size={18} className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;