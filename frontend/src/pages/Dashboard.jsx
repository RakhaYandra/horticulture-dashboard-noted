import React, { useEffect, useState } from "react";
import Select from "react-select";
import komoditas from "@/data/komoditas.json";
import { Card, CardContent } from "@/components/ui/card";
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
  const backend = import.meta.env.VITE_BACKEND_URL;
  const authKey = import.meta.env.VITE_AUTH_KEY;

  const options = komoditas.map((item) => ({
    value: item.fkomcd,
    label: item.fkomnm,
  }));

  const fetchData = async (newFilter) => {
    if (!newFilter || newFilter === "Pilih Komoditas") {
      setError("Silahkan pilih komoditas");
      setForecastData([]);
      setExistingData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestBody = { komoditas: newFilter };

      const [forecastResponse, existingResponse] = await Promise.all([
        fetch(`${backend}/forecast`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authKey}`,
          },
          body: JSON.stringify(requestBody),
        }),
        fetch(`${backend}/existing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authKey}`,
          },
          body: JSON.stringify(requestBody),
        }),
      ]);

      if (!forecastResponse.ok || !existingResponse.ok) {
        const errorData = await Promise.all([
          forecastResponse.json(),
          existingResponse.json(),
        ]);
        console.error("Error Data:", errorData);
        throw new Error("HTTP error! Status: " + forecastResponse.status);
      }

      const [forecast, existing] = await Promise.all([
        forecastResponse.json(),
        existingResponse.json(),
      ]);

      setForecastData(forecast);
      setExistingData(existing);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption.value);
  };

  const Chart = ({ title, data }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Select
            value={
              filter === "Pilih Komoditas"
                ? { value: "", label: "Pilih Komoditas" }
                : options.find((opt) => opt.value === filter)
            }
            onChange={handleFilterChange}
            options={options}
            className="w-64"
            classNamePrefix="select"
            placeholder="Pilih Komoditas"
            isSearchable={true}
          />
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
            data={data}
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
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Horticulture Production Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-6">
        <Chart title="Production Existing" data={existingData} />
        <Chart title="Production Forecast" data={forecastData} />
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
