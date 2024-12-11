import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import komoditas from "@/data/komoditas.json";
import { Calendar, Map, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [existingData, setExistingData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [filter, setFilter] = useState("Pilih Komoditas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const combinedData = useRef({ existing: [], forecast: [] });
  const backend = import.meta.env.VITE_BACKEND_URL;
  const authKey = import.meta.env.VITE_AUTH_KEY;

  const handlefilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);

    fetchData(newFilter);
  };

  const options = komoditas.map((item) => ({
    value: item.fkomcd,
    label: item.fkomnm,
  }));

  const fetchForecastData = async (newFilter) => {
    if (!newFilter || newFilter === "Pilih Komoditas") {
      return { message: "Silahkan pilih komoditas" };
    }

    const requestBody = {
      komoditas: newFilter,
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
      const errorData = await response.json();
      console.error("Error Data:", errorData);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  };

  const fetchExistingData = async (newFilter) => {
    if (!newFilter || newFilter === "Pilih Komoditas") {
      return { message: "Silahkan pilih komoditas" };
    }

    const requestBody = {
      komoditas: newFilter,
    };

    const response = await fetch(`${backend}/existing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Data:", errorData);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  };

  // Update the fetchData function to handle the message
  const fetchData = async (newFilter) => {
    try {
      setLoading(true);
      setError(null);

      const [forecast, existing] = await Promise.all([
        fetchForecastData(newFilter),
        fetchExistingData(newFilter),
      ]);

      if (forecast.message && existing.message) {
        setError("Silahkan pilih komoditas");
        combinedData.current = { forecast: [], existing: [] };
      } else {
        combinedData.current = { forecast, existing };
      }
      logCombinedData();
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const logCombinedData = () => {
    const { forecast, existing } = combinedData.current;
    if (forecast && existing) {
      console.log("Combined Data:", { forecast, existing });
    }
  };

  useEffect(() => {
    fetchData(filter);
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
              <h3 className="text-lg font-semibold">
                Production Existing & Forecast
              </h3>
              <div className="flex gap-2">
                <Select
                  value={
                    filter === "Pilih Komoditas"
                      ? { value: "", label: "Pilih Komoditas" }
                      : options.find((opt) => opt.value === filter)
                  }
                  onChange={(selectedOption) =>
                    handlefilterChange({
                      target: { value: selectedOption.value },
                    })
                  }
                  options={options}
                  className="w-64"
                  classNamePrefix="select"
                  placeholder="Pilih Komoditas"
                  isSearchable={true}
                />
              </div>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                {console.log(combinedData)}
                <LineChart
                  margin={{ left: 50, right: 20 }}
                  width={600}
                  height={300}
                  data={[
                    ...combinedData.current.existing,
                    ...combinedData.current.forecast,
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tahun" />
                  <YAxis dataKey="produksi" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="produksi"
                    stroke="#EF4444"
                    name="Production"
                  />
                </LineChart>
              </>
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
