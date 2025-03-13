import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Car,
  Phone,
  MapPin,
  Shield,
  Clock,
  CreditCard,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SearchBox = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  return (
    <div className="bg-black p-6 rounded-xl w-full max-w-4xl mx-auto shadow-lg border border-gray-800">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F9C80E]">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Pickup Location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black border-2 border-[#F9C80E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F9C80E] transition-colors"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F9C80E]">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Dropoff Location"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black border-2 border-[#F9C80E] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F9C80E] transition-colors"
            />
          </div>
        </div>
        <button className="bg-[#F9C80E] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#F9C80E]/90 transition-colors flex items-center gap-2">
          Search <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
    <div className="flex justify-center mb-6">
      <div className="p-3 bg-[#F9C80E]/10 rounded-full">
        {React.cloneElement(icon, { className: "w-8 h-8 text-[#F9C80E]" })}
      </div>
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="text-center group">
    <div className="w-16 h-16 bg-[#F9C80E] text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ContactCard = ({ icon, title, info }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="w-16 h-16 bg-black text-[#F9C80E] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{info}</p>
  </div>
);

const BackgroundSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3",
    "https://www.pexels.com/photo/self-confident-ethnic-taxi-driver-leaning-on-car-in-city-5835457/",
    "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1536893827774-411e1dc7c902?ixlib=rb-4.0.3",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${image}')`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-75" />
    </div>
  );
};

const Home = () => {
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const scroller = document.querySelector("[data-scrollbar]");
  
    // Animate Features Section
    gsap.from(featuresRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
        scroller: scroller, // Set smooth-scrollbar as the scroller
      },
    });
  
    // Animate How It Works Section
    gsap.from(howItWorksRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: howItWorksRef.current,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
        scroller: scroller, // Set smooth-scrollbar as the scroller
      },
    });
  
    // Animate Contact Section
    gsap.from(contactRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: contactRef.current,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
        scroller: scroller, // Set smooth-scrollbar as the scroller
      },
    });
  
    // Animate Feature Cards with Stagger
    gsap.from(featuresRef.current.querySelectorAll(".feature-card"), {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
        scroller: scroller, // Set smooth-scrollbar as the scroller
      },
    });
  
    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-screen">
        <BackgroundSlider />
        <div className="relative h-full">
          <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
            <div className="max-w-4xl mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Your Premium Ride in Colombo City
              </h1>
              <p className="text-xl text-gray-300 mb-12">
                Experience safe and comfortable travel with Mega City Cab. Book
                your ride instantly and enjoy premium service.
              </p>
              <Link to="/booking">
                <button className="px-6 py-2.5 text-sm font-medium text-black bg-[#F9C80E] rounded-lg hover:bg-[#F9C80E]/90 focus:outline-none focus:ring-2 focus:ring-[#F9C80E] focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative z-10 -mt-15">
        <SearchBox />
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Mega City Cab?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock />}
              title="24/7 Service"
              description="Available round the clock for your convenience"
            />
            <FeatureCard
              icon={<Shield />}
              title="Safe Travel"
              description="Verified drivers and secure rides"
            />
            <FeatureCard
              icon={<CreditCard />}
              title="Easy Payment"
              description="Multiple payment options available"
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div ref={howItWorksRef} className="bg-white py-24 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Book Your Ride"
              description="Choose your pickup location and destination"
            />
            <StepCard
              number="2"
              title="Get Matched"
              description="We'll connect you with the nearest driver"
            />
            <StepCard
              number="3"
              title="Enjoy the Journey"
              description="Track your ride and reach safely"
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div ref={contactRef} className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <ContactCard
              icon={<Phone className="w-8 h-8" />}
              title="Call Us"
              info="+94 11 2345678"
            />
            <ContactCard
              icon={<MapPin className="w-8 h-8" />}
              title="Location"
              info="Colombo City, Sri Lanka"
            />
            <ContactCard
              icon={<Car className="w-8 h-8" />}
              title="For Drivers"
              info="Join our team"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;