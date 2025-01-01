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

      setForecastData(forecast.sort((a, b) => a.tahun - b.tahun));
      setExistingData(existing.sort((a, b) => a.tahun - b.tahun));
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

  const formatValue = (value) => {
    return new Intl.NumberFormat("id-ID").format(value);
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
          <p>Memuat...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <LineChart
              margin={{ top: 20, left: 50, right: 20, bottom: 20 }}
              width={600}
              height={300}
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tahun" />
              <YAxis
                dataKey="produksi"
                domain={[0, "dataMax + 500"]}
                tickFormatter={(value) => {
                  const formattedValue = value / 100;
                  if (formattedValue >= 1000000) {
                    return `${(formattedValue / 1000000).toFixed(2)} Juta`;
                  } else if (formattedValue >= 1000) {
                    return `${(formattedValue / 1000).toFixed(2)} Ribu`;
                  } else {
                    return `${formattedValue.toFixed(2)}`;
                  }
                }}
              />
              <Tooltip
                formatter={(value) => {
                  const formattedValue = value / 100;
                  if (formattedValue >= 1000000) {
                    return `${(formattedValue / 1000000).toFixed(2)} Juta`;
                  } else if (formattedValue >= 1000) {
                    return `${(formattedValue / 1000).toFixed(2)} Ribu`;
                  } else {
                    return `${formattedValue.toFixed(2)}`;
                  }
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="produksi"
                stroke="#1D7D0D"
                name="Produksi"
              />
            </LineChart>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Dashboard Data Produksi Hortikultura Nasional
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Chart title="Produksi Eksisting" data={existingData} />
        <Chart title="Prakiraan Produksi" data={forecastData} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-center border-b-2 border-gray-300">No</th>
              <th className="p-3 text-center border-b-2 border-gray-300">
                Tahun (Eksisting)
              </th>
              <th className="p-3 text-center border-b-2 border-gray-300">
                Produksi (Eksisting)
              </th>
              <th className="p-3 text-center border-b-2 border-gray-300">
                Produktivitas (Eksisting)
              </th>
              <th className="p-3 text-center border-b-2 border-gray-300">
                Tahun (Prakiraan)
              </th>
              <th className="p-3 text-center border-b-2 border-gray-300">
                Produksi (Prakiraan)
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-3 text-center">
                  Memuat...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : (
              existingData.map((data, index) => (
                <tr key={index}>
                  <td className="p-3 border-b border-gray-300 text-center">
                    {index + 1}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-center">
                    {data.tahun}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-center">
                    {formatValue(data.produksi / 100)}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-center">
                    {formatValue(data.produktivitas / 100)}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-center">
                    {forecastData[index]?.tahun || "-"}
                  </td>
                  <td className="p-3 border-b border-gray-300 text-center">
                    {forecastData[index]?.produksi !== undefined &&
                    forecastData[index]?.produksi !== null
                      ? formatValue(forecastData[index].produksi / 100)
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
