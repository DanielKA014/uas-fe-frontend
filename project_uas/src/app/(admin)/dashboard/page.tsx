"use client";
import Image from "next/image";
import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function AdminHome() {
  const [filter, setFilter] = useState("mostReviews");

  const restaurantRating = { average: 4.7, totalReviews: 256 };

  const menuItems = [
    { id: 1, name: "Ayam Bakar", image: "/images/makanan/ayam-bakar.jpeg", rating: 4.8, reviews: 150 },
    { id: 2, name: "Es Teh Manis", image: "/images/makanan/es-teh.png", rating: 4.3, reviews: 98 },
    { id: 3, name: "Tahu Goreng", image: "/images/makanan/tahu.jpeg", rating: 4.6, reviews: 120 },
  ];

  const sorted =
    filter === "highestRated"
      ? [...menuItems].sort((a, b) => b.rating - a.rating)
      : [...menuItems].sort((a, b) => b.reviews - a.reviews);

  //  function for star rendering 
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} color="#facc15" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#facc15" />);
      else stars.push(<FaRegStar key={i} color="#facc15" />);
    }
    return stars;
  };

  return (
    <div>
      {/* Top overview */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>Restaurant Overview</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 40, color: "#d97706", fontWeight: 700 }}>
              {restaurantRating.average}
            </div>
            <div style={{ display: "flex", gap: 2 }}>{renderStars(restaurantRating.average)}</div>
            <div style={{ color: "#6b7280", marginTop: 6 }}>
              {restaurantRating.totalReviews} reviews
            </div>
          </div>
          <div>
            <Image
              src="/images/makanan/ayam-bakar.jpeg"
              alt="overview"
              width={160}
              height={120}
              style={{ borderRadius: 8, objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>Menu Ratings</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="mostReviews">Most Reviews</option>
          <option value="highestRated">Highest Rated</option>
        </select>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {sorted.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              padding: 14,
              borderRadius: 8,
              display: "flex",
              gap: 12,
              alignItems: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={90}
                height={90}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{item.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                {renderStars(item.rating)}
                <span style={{ color: "#6b7280", marginLeft: 6 }}>
                  {item.rating.toFixed(1)}
                </span>
              </div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>
                {item.reviews} reviews
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
