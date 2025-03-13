import { Link } from "react-router-dom";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
} from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-6">
        {/* Top Section with Logo and Description */}
        <div className="flex flex-col items-center mb-10">
          <h3 className="text-3xl font-bold mb-3 text-yellow-400">
            MegaCityCab
          </h3>
          <p className="text-gray-400 text-center max-w-md">
            Your reliable cab service in Colombo. Safe, comfortable, and
            available 24/7.
          </p>
        </div>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-semibold mb-4 text-yellow-400 border-b-2 border-yellow-400 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3 text-center md:text-left">
              <li>
                <Link
                  to="/"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-yellow-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/book"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Book a Ride
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-semibold mb-4 text-yellow-400 border-b-2 border-yellow-400 pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPinIcon className="w-5 h-5 mr-3 text-yellow-400" /> Colombo,
                Sri Lanka
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3 text-yellow-400" /> +94 11
                2345678
              </li>
              <li className="flex items-center">
                <MailIcon className="w-5 h-5 mr-3 text-yellow-400" />{" "}
                info@megacitycab.com
              </li>
            </ul>
          </div>
          {/* Operating Hours */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl font-semibold mb-4 text-yellow-400 border-b-2 border-yellow-400 pb-2 inline-block">
              Operating Hours
            </h4>
            <ul className="space-y-3 text-center md:text-left">
              <li>Monday - Friday: 24 Hours</li>
              <li>Saturday: 24 Hours</li>
              <li>Sunday: 24 Hours</li>
              <li className="text-yellow-400 font-semibold">
                Always at your service!
              </li>
            </ul>
          </div>
        </div>
        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 text-black p-3 rounded-full hover:bg-yellow-300 transition-colors"
          >
            <FacebookIcon className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 text-black p-3 rounded-full hover:bg-yellow-300 transition-colors"
          >
            <TwitterIcon className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 text-black p-3 rounded-full hover:bg-yellow-300 transition-colors"
          >
            <InstagramIcon className="w-5 h-5" />
          </a>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-800"></div>
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MegaCityCab. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="/terms"
              className="text-sm text-gray-500 hover:text-yellow-400"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-500 hover:text-yellow-400"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
