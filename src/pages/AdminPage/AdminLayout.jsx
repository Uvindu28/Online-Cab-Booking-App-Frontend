import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 text-white overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
