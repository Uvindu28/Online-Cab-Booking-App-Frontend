import { Routes, Route } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import AdminDashboard from './AdminDashboard'

const AdminRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<AdminLayout/>}>
                <Route index element={<AdminDashboard/>} />
                <Route path="dashboard" element={<AdminDashboard/>} />
            </Route>
        </Routes>
      
    </div>
  )
}

export default AdminRoutes
