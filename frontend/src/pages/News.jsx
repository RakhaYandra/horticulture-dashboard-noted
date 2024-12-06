import React, { useState, useEffect } from "react";
import NewsItem from "../components/NewsItem"; // Pastikan path menuju komponen benar
import { Button } from "@/components/ui/button"; // Pastikan path menuju komponen benar

const News = () => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const authKey = import.meta.env.VITE_AUTH_KEY;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [comment, setComment] = useState("");
  const maxCharacters = 500;

  const fetchNewsData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${backend}/news`, {
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
      setNewsData(data);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching news data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  return (
    <div className="flex flex-col items-center p-0 w-full">
      <div className="flex flex-col items-start w-full px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left w-full">
          News Summary
        </h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
          {newsData.map((news, index) => (
            <a
              href={news.link}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
            >
              <NewsItem
                position={news.position}
                title={news.title}
                source={news.source}
                date={news.date}
                imageUrl={news.thumbnail}
                snippet={news.snippet}
              />
            </a>
          ))}
        </div>
        <div className="relative flex flex-col justify items-end p-4 gap-2 w-full h-[162px] bg-white border border-gray-400 rounded-lg mt-20">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={maxCharacters}
            className="w-full h-10 p-2 border-none rounded m-2 mb-2"
            placeholder="Place your prompt here..."
          />
          <div className="absolute left-4 bottom-4 text-sm text-gray-500 m-2">
            {comment.length}/{maxCharacters}
          </div>
          <Button className="absolute right-4 bottom-4 h-10 bg-green-500 text-white rounded m-2">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default News;
