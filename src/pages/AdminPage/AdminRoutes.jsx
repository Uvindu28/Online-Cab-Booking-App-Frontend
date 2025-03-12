import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import ShowBooking from '../BookingPage/ShowBooking';
import ShowDrivers from '../DriverPage/ShowDrivers'
import ShowCustomers from '../CustomerPage/ShowCustomers';
import ShowVehicle from '../VehiclePage/ShowVehicle';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="bookings" element={<ShowBooking />} />
        <Route path="drivers" element={<ShowDrivers />} />
        <Route path="customers" element={<ShowCustomers />} />
        <Route path="cars" element={<ShowVehicle />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;