import { Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage/Home";
import Header from "./components/Header.jsx";
import CustomerRegister from "./pages/CustomerPage/Register";
import DriverRegister from "./pages/DriverPage/Register.jsx";
import Booking from "./pages/BookingPage/Booking";
import Footer from "./components/Footer";
import BillingPage from "./pages/BillingPage/Billing";
import Login from "./components/Login";
import AdminRoutes from "./pages/AdminPage/AdminRoutes.jsx";
import CustomerProfile from "./pages/CustomerPage/CustomerProfilePage.jsx";
import DriverProfile from "./pages/DriverPage/DriverProfile.jsx";
import ForgotPassword from "./components/ForgetPassword.jsx";
import ResetPassword from "./components/RestPassword.jsx";
// import SmoothScroll from "./components/SmoothScroll.jsx"; // Import the SmoothScroll component

function App() {
  return (
    // <SmoothScroll> {/* Wrap everything inside SmoothScroll */}
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <Header />
                <Home />
                <Footer />
              </main>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/customerSignup" element={<CustomerRegister />} />
          <Route path="/driverSignup" element={<DriverRegister/>}/>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/cusProfile" element={<CustomerProfile />} />
          <Route path="/driverProfile" element={<DriverProfile />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/Billing" element={<BillingPage />} />
        </Routes>
      </div>
    // </SmoothScroll>
  );
}

export default App;
