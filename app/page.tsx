"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { calculateFuzzyOutput } from "@/lib/fuzzy-logic";
import { TemperatureChart } from "@/components/temperature-chart";

export default function Home() {
  const [temperature, setTemperature] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const result = calculateFuzzyOutput(temperature);

  // Function to calculate temperature from mouse/touch position
  const calculateTemperature = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    return Math.round((10 + percentage * 30) * 10) / 10; // 10°C to 40°C with 0.1 step
  };

  // Handle click on slider track
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newTemp = calculateTemperature(e.clientX);
    if (newTemp !== undefined) setTemperature(newTemp);
  };

  // Handle mouse down on thumb
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle touch start on thumb
  const handleTouchStart = () => {
    setIsDragging(true);
  };

  // Effect for handling drag events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newTemp = calculateTemperature(e.clientX);
        if (newTemp !== undefined) setTemperature(newTemp);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        const newTemp = calculateTemperature(e.touches[0].clientX);
        if (newTemp !== undefined) setTemperature(newTemp);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    // Clean up
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <main className="main">
      <div className="container">
        <header className="header">
          <h1 className="title">Sistem Pakar Kondisi Suhu Ruangan</h1>
          <p className="subtitle">Menggunakan Metode Fuzzy Sugeno</p>
        </header>

        <div className="grid grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Input Suhu</h2>
              <p className="card-description">
                Masukkan suhu ruangan dalam derajat Celcius
              </p>
            </div>
            <div className="card-content">
              <div className="slider-container">
                <div className="slider-header">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M2 12h10" />
                    <path d="M9 4v16" />
                    <path d="M3 9v6" />
                    <path d="M13 6V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-3" />
                    <path d="M13 10v4" />
                    <path d="m20 2-3 3" />
                    <path d="m20 22-3-3" />
                    <path d="m22 5-5 5" />
                    <path d="m22 19-5-5" />
                  </svg>
                  <span className="temperature-value">{temperature}°C</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                    <path d="M10 13V4" />
                    <path d="m7 17 3-3 3 3" />
                  </svg>
                </div>
                <div
                  className="slider"
                  onClick={handleSliderClick}
                  ref={sliderRef}
                >
                  <div
                    className="slider-track"
                    style={{ width: `${((temperature - 10) / 30) * 100}%` }}
                  ></div>
                  <div
                    className="slider-thumb"
                    style={{ left: `${((temperature - 10) / 30) * 100}%` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  ></div>
                </div>
                <div className="slider-labels">
                  <span>10°C</span>
                  <span>25°C</span>
                  <span>40°C</span>
                </div>

                {/* Tambahkan input manual untuk nilai suhu */}
                <div className="manual-input">
                  <label
                    htmlFor="temperature-input"
                    className="manual-input-label"
                  >
                    Input manual:
                  </label>
                  <input
                    type="number"
                    id="temperature-input"
                    min="10"
                    max="40"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 10 && value <= 40) {
                        setTemperature(value);
                      }
                    }}
                    className="manual-input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Hasil Analisis</h2>
              <p className="card-description">
                Kondisi suhu ruangan berdasarkan input
              </p>
            </div>
            <div className="card-content">
              <div className="result-header">
                <div className="result-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={getTemperatureIconColor(result.condition)}
                  >
                    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="result-title">{result.condition}</h3>
                  <p className="result-subtitle">
                    Derajat keanggotaan: {result.degree.toFixed(2)}
                  </p>
                </div>
              </div>
              <div>
                {result.memberships.map((item) => (
                  <div key={item.set} className="membership-item">
                    <span className="membership-label">{item.set}</span>
                    <div className="membership-bar">
                      <div
                        className={`membership-value ${getMembershipColor(
                          item.set
                        )}`}
                        style={{ width: `${item.degree * 100}%` }}
                      ></div>
                    </div>
                    <span className="membership-percentage">
                      {(item.degree * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card col-span-2">
            <div className="card-header">
              <h2 className="card-title">Visualisasi Fungsi Keanggotaan</h2>
              <p className="card-description">
                Grafik fungsi keanggotaan fuzzy untuk suhu ruangan
              </p>
            </div>
            <div className="card-content">
              <TemperatureChart currentTemperature={temperature} />
              <div className="chart-legend">
                <p className="legend-title">Keterangan:</p>
                <p>
                  • Titik hitam pada setiap kurva menunjukkan derajat
                  keanggotaan suhu saat ini ({temperature}°C) pada masing-masing
                  kategori.
                </p>
                <p>
                  • Garis putus-putus vertikal menunjukkan posisi suhu saat ini
                  pada skala.
                </p>
                <p>
                  • Semakin tinggi posisi titik pada kurva, semakin tinggi
                  derajat keanggotaan suhu tersebut pada kategori yang
                  bersangkutan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function getTemperatureIconColor(condition: string) {
  switch (condition) {
    case "Dingin":
      return "text-blue-600";
    case "Sejuk":
      return "text-blue-400";
    case "Normal":
      return "text-green-500";
    case "Panas":
      return "text-orange-500";
    case "Sangat Panas":
      return "text-red-600";
    default:
      return "";
  }
}

function getMembershipColor(set: string) {
  switch (set) {
    case "Dingin":
      return "bg-blue-600";
    case "Sejuk":
      return "bg-blue-400";
    case "Normal":
      return "bg-green-500";
    case "Panas":
      return "bg-orange-500";
    case "Sangat Panas":
      return "bg-red-600";
    default:
      return "";
  }
}
