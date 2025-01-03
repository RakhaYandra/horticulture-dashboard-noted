import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NewsItem from "../components/NewsItem"; // Pastikan path ke komponen benar

const News = () => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const authKey = import.meta.env.VITE_AUTH_KEY;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [analysis, setAnalysis] = useState("");

  const fetchData = async (url, setData) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backend}/llm-analysis`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }

      setAnalysis(result);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching analysis data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(`${backend}/news`, setNewsData);
    fetchAnalysis();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <div className="flex flex-col items-start w-full px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-12 text-left w-full">
          Berita Terkait
        </h1>
        {loading && <p>Memuat...</p>}
        {error && <p>Error: {error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
          <div className="flex flex-col gap-y-12 mt-2">
            {newsData.map((news, index) => (
              <a
                href={news.link}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
              >
                <NewsItem
                  position={String(news.position)}
                  title={news.title}
                  source={news.source}
                  date={news.date}
                  imageUrl={news.thumbnail}
                  snippet={news.snippet}
                />
              </a>
            ))}
          </div>
          <div className="bg-white shadow-xl rounded-2xl border border-gray-150 h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 px-5 pt-5 pb-3 border-b border-gray-100">
              Ringkasan
            </h2>
            <div className="px-5 py-4 text-justify" aria-live="polite">
              {loading ? (
                <div className="flex items-center text-gray-700 py-2">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Memuat ringkasan...</span>
                </div>
              ) : error ? (
                <span className="text-red-600 py-2 block">{error}</span>
              ) : (
                <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {analysis}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
