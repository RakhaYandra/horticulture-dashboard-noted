import React from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
