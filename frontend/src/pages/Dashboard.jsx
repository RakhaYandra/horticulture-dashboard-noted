import React, { useEffect, useState } from "react";
import { Calendar, Map, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const authKey = import.meta.env.VITE_AUTH_KEY;

  // Function to fetch forecast data
  const fetchForecastData = async () => {
    try {
      setLoading(true);

      const requestBody = {
        komoditas: 1170,
      };

      const response = await fetch(`${backend}/forecast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Response Data:", data);
      setForecastData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching forecast data:", err);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold">
        Horticulture Production Dashboard
      </h1>

      {/* Date Range Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white border rounded-lg p-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span>Start date</span>
        </div>
        <Button variant="default" className="bg-green-600 hover:bg-green-700">
          <ChevronRight className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 bg-white border rounded-lg p-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span>End date</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg text-gray-600 mb-2">Vegetables</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold">680 tons</span>
              <span className="text-sm px-2 py-1 bg-green-100 text-green-600 rounded">
                +2.5%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg text-gray-600 mb-2">Fruits</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold">360 tons</span>
              <span className="text-sm px-2 py-1 bg-red-100 text-red-600 rounded">
                -1.2%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg text-gray-600 mb-2">Tobacco</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-semibold">440 tons</span>
              <span className="text-sm px-2 py-1 bg-green-100 text-green-600 rounded">
                +11%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Production Forecast */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Production Forecast</h3>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Monthly
                </Button>
                <Button variant="outline">Yearly</Button>
              </div>
            </div>
            <div className="flex gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Current Year</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Past Year</span>
              </div>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <LineChart
                margin={{ left: 50, right: 20 }}
                width={600}
                height={300}
                data={forecastData}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tahun" />
                <YAxis datakey="produksi" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="produksi" stroke="#EF4444" />
              </LineChart>
            )}
          </CardContent>
        </Card>

        {/* Performance by Location */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Performance by Location</h3>
              <Button variant="link" className="text-green-600">
                See More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {[
              "DKI Jakarta",
              "Jawa Barat",
              "Jawa Timur",
              "Jawa Tengah",
              "Sumatera Barat",
            ].map((location) => (
              <div
                key={location}
                className="flex justify-between items-center py-3 border-b"
              >
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  <span>{location}</span>
                </div>
                <span>20 tons</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weather Forecast */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weather Forecast</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">☀️</span>
                  <span>Today</span>
                </div>
                <span>Sunny, 25°C</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⛅</span>
                  <span>Tomorrow</span>
                </div>
                <span>Partly Cloudy, 23°C</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💧</span>
                  <span>Precipitation</span>
                </div>
                <span>20% chance of rain</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
