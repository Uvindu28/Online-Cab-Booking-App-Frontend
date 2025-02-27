import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* About Section */}
        <div>
          <h3 className="text-2xl font-bold mb-3">MegaCityCab</h3>
          <p className="text-gray-400">Your reliable cab service in Colombo. Safe, comfortable, and available 24/7.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            <li><Link to="/book" className="hover:text-emerald-400 transition-colors">Book a Ride</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-center md:justify-start">
              <MapPin className="w-5 h-5 mr-2 text-emerald-400" /> Colombo, Sri Lanka
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <Phone className="w-5 h-5 mr-2 text-emerald-400" /> +94 11 2345678
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <Mail className="w-5 h-5 mr-2 text-emerald-400" /> info@megacitycab.com
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 flex justify-center space-x-6">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
          <Facebook className="w-6 h-6" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
          <Twitter className="w-6 h-6" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
          <Instagram className="w-6 h-6" />
        </a>
      </div>

      {/* Copyright */}
      <p className="text-center text-gray-500 text-sm mt-6">© {new Date().getFullYear()} MegaCityCab. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
