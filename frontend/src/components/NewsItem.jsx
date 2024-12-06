import React from "react";

const NewsItem = ({ source, date, title, snippet, imageUrl }) => {
  return (
    <div className="flex flex-row justify-between items-center gap-8 w-[550px] h-[116px]">
      {/* Konten */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{source}</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 12.75l3-3 3 3m-3-3v9"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 21h-15a2.25 2.25 0 0 1-2.25-2.25v-15A2.25 2.25 0 0 1 4.5 1.5h15a2.25 2.25 0 0 1 2.25 2.25v15A2.25 2.25 0 0 1 19.5 21z"
              />
            </svg>
            {date}
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{snippet}</p>
      </div>

      {/* Gambar */}
      <div
        className="w-[100px] h-[100px] bg-cover bg-center rounded-md"
        style={{
          backgroundImage: `linear-gradient(180.3deg, rgba(0, 0, 0, 0.2) 40.67%, rgba(0, 0, 0, 0) 99.74%), url(${imageUrl})`,
        }}
      ></div>
    </div>
  );
};

export default NewsItem;
