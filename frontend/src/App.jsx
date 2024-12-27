import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`flex-grow p-6 transition-all duration-300 ${
          isOpen ? "ml-0" : "ml-64"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Layout>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;