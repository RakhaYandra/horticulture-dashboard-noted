import React, { useState } from "react";
import NewsItem from "../components/NewsItem"; // Pastikan path menuju komponen benar
import { Button } from "@/components/ui/button"; // Pastikan path menuju komponen benar

const News = () => {
  const [comment, setComment] = useState("");
  const maxCharacters = 500;

  const newsData = [
    {
      position: 1,
      title:
        "Petani Stroberi di Jawa Timur Catat Rekor Produksi Terbesar Tahun Ini",
      source: "Hortikultura Harian",
      date: "10/08/2021",
      thumbnail: "/images/strawberries.jpg",
      snippet:
        "Para petani stroberi di Kabupaten Malang berhasil mencapai rekor produksi tertinggi tahun ini dengan peningkatan hingga 30% dibandingkan tahun lalu.",
    },
    {
      position: 2,
      title:
        "Budidaya Anggur Lokal di Bali Menunjukkan Potensi Besar untuk Pasar Global",
      source: "Pertanian Nusantara",
      date: "11/08/2021",
      thumbnail: "/images/grapes.jpg",
      snippet:
        "Para petani di Bali menemukan peluang ekspor baru untuk anggur lokal mereka. Dengan teknik pemuliaan khusus, anggur Bali kini memenuhi standar pasar global.",
    },
    {
      position: 3,
      title: "Harga Cabai di Pasar Tradisional Melonjak Akibat Cuaca Ekstrem",
      source: "Berita Tani",
      date: "12/08/2021",
      thumbnail: "/images/chili-peppers.jpg",
      snippet:
        "Cuaca ekstrem yang melanda wilayah sentra cabai di Jawa Tengah menyebabkan penurunan hasil panen. Akibatnya, harga cabai di pasar tradisional naik drastis.",
    },
    {
      position: 4,
      title:
        "Tomat Super dengan Kandungan Gizi Tinggi Mulai Dipasarkan di Indonesia",
      source: "Agro Media",
      date: "13/08/2021",
      thumbnail: "/images/tomatoes.jpg",
      snippet:
        "Varietas baru tomat yang kaya akan antioksidan dan vitamin C mulai dipasarkan di supermarket besar Indonesia.",
    },
    {
      position: 5,
      title:
        "Teknologi Pertanian Modern Meningkatkan Hasil Panen Padi di Jawa Barat",
      source: "Tekno Tani",
      date: "14/08/2021",
      thumbnail: "/images/rice.jpg",
      snippet:
        "Penggunaan teknologi pertanian modern telah meningkatkan hasil panen padi di Jawa Barat hingga 25% dibandingkan tahun sebelumnya.",
    },
    {
      position: 6,
      title: "Inovasi Pertanian Vertikal di Perkotaan Menjadi Tren Baru",
      source: "Urban Farming",
      date: "15/08/2021",
      thumbnail: "/images/vertical-farming.jpg",
      snippet:
        "Pertanian vertikal di perkotaan menjadi tren baru yang menjanjikan solusi untuk keterbatasan lahan dan kebutuhan pangan yang terus meningkat.",
    },
    {
      position: 7,
      title: "Pengembangan Varietas Unggul Jagung untuk Ketahanan Pangan",
      source: "Agri News",
      date: "16/08/2021",
      thumbnail: "/images/corn.jpg",
      snippet:
        "Peneliti pertanian berhasil mengembangkan varietas unggul jagung yang lebih tahan terhadap hama dan penyakit, serta memiliki produktivitas tinggi.",
    },
    {
      position: 8,
      title: "Kopi Lokal Indonesia Semakin Diminati di Pasar Internasional",
      source: "Coffee Times",
      date: "17/08/2021",
      thumbnail: "/images/coffee.jpg",
      snippet:
        "Kopi lokal Indonesia semakin diminati di pasar internasional berkat kualitasnya yang tinggi dan cita rasa yang khas.",
    },
    {
      position: 9,
      title: "Penggunaan Drone dalam Pertanian Meningkatkan Efisiensi",
      source: "Tekno Tani",
      date: "18/08/2021",
      thumbnail: "/images/drone.jpg",
      snippet:
        "Penggunaan drone dalam pertanian telah meningkatkan efisiensi dan hasil panen dengan pemantauan yang lebih akurat dan penyemprotan yang lebih tepat.",
    },
    {
      position: 10,
      title: "Pertanian Organik Semakin Populer di Kalangan Petani Muda",
      source: "Agro Media",
      date: "19/08/2021",
      thumbnail: "/images/organic-farming.jpg",
      snippet:
        "Pertanian organik semakin populer di kalangan petani muda yang ingin menghasilkan produk yang lebih sehat dan ramah lingkungan.",
    },
  ];

  return (
    <div className="flex flex-col items-center p-0 w-full">
      <div className="flex flex-col items-start w-full px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left w-full">
          News Summary
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10">
          {newsData.map((news, index) => (
            <NewsItem
              key={index}
              position={news.position}
              title={news.title}
              source={news.source}
              date={news.date}
              imageUrl={news.thumbnail}
              snippet={news.snippet}
            />
          ))}
        </div>
        <div className="relative flex flex-col justify items-end p-4 gap-2 w-full h-[162px] bg-white border border-gray-400 rounded-lg mt-10">
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
