import { Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage/Home'
import Header from './components/Header'
import DriverLogin from './pages/DriverPage/Login'
import CustomerRegister from './pages/CustomerPage/Register'
import Booking from './pages/BookingPage/Booking'
import Footer from './components/Footer'
import BillingPage from './pages/BillingPage/Billing'
import Dashboard from './pages/AdminPage/AdminSidebar'
import CusDashboard from './pages/CustomerPage/Dashboard'
import Login from './components/Login'

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={
            <main>
              <Header/>
              <Home/>
              <Footer/>
            </main>
          }/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/driverlogin' element={<DriverLogin/>}/>
          <Route path='/customerSignup' element={<CustomerRegister/>}/>
          <Route path='/adminDashboard' element={<Dashboard/>}/>
          <Route path='/cusDashboard' element={<CusDashboard/>}/>
          <Route path='/booking' element={<Booking/>}/>
          <Route path='/Billing' element={<BillingPage/>}/>
          <Route path='/admin/*'/>
        </Routes>
      </div>
      
    </>
  )
}

export default App
