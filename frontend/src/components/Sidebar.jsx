import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Newspaper, Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Navigation items array
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home className="w-6 h-6" />,
    },
    {
      name: "Berita",
      path: "/news",
      icon: <Newspaper className="w-6 h-6" />,
    },
  ];

  useEffect(() => {
    const currentItem = navigationItems.find(
      (item) => item.path === location.pathname
    );
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [location.pathname]);

  // Filter navigation items based on search term
  const filteredItems = navigationItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#dde1e6] p-6 transition-transform transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center w-full px-6 py-4">
          <img
            src={logo}
            alt="Company Logo"
            className="h-12 w-auto object-contain hover:opacity-80 hover:scale-105 transition-all duration-200"
          />
        </div>

        {/* Search Field */}
        <div className="relative w-full mb-2">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Cari..."
            className="w-full h-12 pl-10 bg-gray-100 border-b border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col w-full gap-1">
          {filteredItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2 px-2 py-3 rounded-lg cursor-pointer ${
                activeItem === item.name
                  ? "bg-[#1D7D0D] text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setActiveItem(item.name);
                setIsOpen(false);
              }}
            >
              {item.icon}
              <span className="text-base font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
