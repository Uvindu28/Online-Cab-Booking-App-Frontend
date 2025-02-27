import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./utils/AuthContext";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)
