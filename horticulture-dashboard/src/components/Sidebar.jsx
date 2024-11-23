import React from "react";
import {
  User,
  Settings,
  Bell,
  Search,
  Home,
  Package,
  Apple,
  Leaf,
  Wind,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-start w-64 h-screen bg-white border-r border-[#dde1e6] p-6 gap-4">
      {/* Top Section with User, Settings, Notifications */}
      <div className="flex items-center justify-between w-full gap-4 mb-2">
        {/* User Avatar */}
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
          <User className="w-6 h-6 text-gray-400" />
        </div>

        {/* Settings Button */}
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200">
          <Settings className="w-6 h-6 text-[#001d6c]" />
        </div>

        {/* Notifications Button */}
        <div className="relative flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200">
          <Bell className="w-6 h-6 text-[#001d6c]" />
          <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-600 rounded-full">
            9
          </div>
        </div>
      </div>

      {/* Search Field */}
      <div className="relative w-full mb-2">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search for..."
          className="w-full h-12 pl-10 bg-gray-100 border-b border-gray-300"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col w-full gap-1">
        {/* Dashboard */}
        <div className="flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
          <Home className="w-6 h-6" />
          <span className="text-base font-medium">Dashboard</span>
        </div>

        {/* Product (with submenu) */}
        <div className="flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
          <Package className="w-6 h-6" />
          <span className="text-base font-medium">Product</span>
        </div>

        {/* Submenu Items */}
        <div className="flex flex-col pl-10 gap-1">
          <div className="flex items-center gap-2 px-2 py-3 text-base hover:bg-gray-100 cursor-pointer">
            <Apple className="w-5 h-5" />
            <span>Fruits</span>
          </div>

          <div className="flex items-center gap-2 px-2 py-3 text-base hover:bg-gray-100 cursor-pointer">
            <Leaf className="w-5 h-5" />
            <span>Vegetable</span>
          </div>

          <div className="flex items-center gap-2 px-2 py-3 text-base hover:bg-gray-100 cursor-pointer">
            <Wind className="w-5 h-5" />
            <span>Tobacco</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
