"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { calculateFuzzyOutput } from "@/lib/fuzzy-logic";

export default function Home() {
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [isDraggingTemp, setIsDraggingTemp] = useState(false);
  const [isDraggingHumidity, setIsDraggingHumidity] = useState(false);
  const tempSliderRef = useRef<HTMLDivElement>(null);
  const humiditySliderRef = useRef<HTMLDivElement>(null);
  const result = calculateFuzzyOutput(temperature, humidity);

  // Function to calculate temperature from mouse/touch position
  const calculateTemperature = (clientX: number) => {
    if (!tempSliderRef.current) return;

    const rect = tempSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    return Math.round((10 + percentage * 30) * 10) / 10; // 10°C to 40°C with 0.1 step
  };

  // Function to calculate humidity from mouse/touch position
  const calculateHumidity = (clientX: number) => {
    if (!humiditySliderRef.current) return;

    const rect = humiditySliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    return Math.round(percentage * 100); // 0% to 100%
  };

  // Handle click on temperature slider track
  const handleTempSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newTemp = calculateTemperature(e.clientX);
    if (newTemp !== undefined) setTemperature(newTemp);
  };

  // Handle click on humidity slider track
  const handleHumiditySliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newHumidity = calculateHumidity(e.clientX);
    if (newHumidity !== undefined) setHumidity(newHumidity);
  };

  // Handle mouse down on temperature thumb
  const handleTempMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingTemp(true);
  };

  // Handle mouse down on humidity thumb
  const handleHumidityMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingHumidity(true);
  };

  // Handle touch start on temperature thumb
  const handleTempTouchStart = () => {
    setIsDraggingTemp(true);
  };

  // Handle touch start on humidity thumb
  const handleHumidityTouchStart = () => {
    setIsDraggingHumidity(true);
  };

  // Effect for handling temperature drag events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingTemp) {
        const newTemp = calculateTemperature(e.clientX);
        if (newTemp !== undefined) setTemperature(newTemp);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingTemp && e.touches[0]) {
        const newTemp = calculateTemperature(e.touches[0].clientX);
        if (newTemp !== undefined) setTemperature(newTemp);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTemp(false);
    };

    const handleTouchEnd = () => {
      setIsDraggingTemp(false);
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
  }, [isDraggingTemp]);

  // Effect for handling humidity drag events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHumidity) {
        const newHumidity = calculateHumidity(e.clientX);
        if (newHumidity !== undefined) setHumidity(newHumidity);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingHumidity && e.touches[0]) {
        const newHumidity = calculateHumidity(e.touches[0].clientX);
        if (newHumidity !== undefined) setHumidity(newHumidity);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingHumidity(false);
    };

    const handleTouchEnd = () => {
      setIsDraggingHumidity(false);
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
  }, [isDraggingHumidity]);

  return (
    <main className="main">
      <div className="container">
        <header className="header">
          <h1 className="title">Sistem Pakar Prediksi Cuaca</h1>
          <p className="subtitle">Menggunakan Metode Fuzzy Sugeno</p>
        </header>

        <div className="grid grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Input Suhu</h2>
              <p className="card-description">
                Masukkan suhu dalam derajat Celcius
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
                    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                    <path d="M10 13V4" />
                  </svg>
                  <span className="temperature-value">{temperature}°C</span>
                </div>
                <div
                  className="slider"
                  onClick={handleTempSliderClick}
                  ref={tempSliderRef}
                >
                  <div
                    className="slider-track"
                    style={{ width: `${((temperature - 10) / 30) * 100}%` }}
                  ></div>
                  <div
                    className="slider-thumb"
                    style={{ left: `${((temperature - 10) / 30) * 100}%` }}
                    onMouseDown={handleTempMouseDown}
                    onTouchStart={handleTempTouchStart}
                  ></div>
                </div>
                <div className="slider-labels">
                  <span>10°C</span>
                  <span>25°C</span>
                  <span>40°C</span>
                </div>

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
              <h2 className="card-title">Input Kelembapan</h2>
              <p className="card-description">
                Masukkan kelembapan dalam persentase
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
                    className="text-orange-500"
                  >
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                  </svg>
                  <span className="temperature-value">{humidity}%</span>
                </div>
                <div
                  className="slider"
                  onClick={handleHumiditySliderClick}
                  ref={humiditySliderRef}
                >
                  <div
                    className="slider-track slider-track-orange"
                    style={{ width: `${humidity}%` }}
                  ></div>
                  <div
                    className="slider-thumb slider-thumb-orange"
                    style={{ left: `${humidity}%` }}
                    onMouseDown={handleHumidityMouseDown}
                    onTouchStart={handleHumidityTouchStart}
                  ></div>
                </div>
                <div className="slider-labels">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>

                <div className="manual-input">
                  <label
                    htmlFor="humidity-input"
                    className="manual-input-label"
                  >
                    Input manual:
                  </label>
                  <input
                    type="number"
                    id="humidity-input"
                    min="0"
                    max="100"
                    step="1"
                    value={humidity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 100) {
                        setHumidity(value);
                      }
                    }}
                    className="manual-input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card col-span-2">
            <div className="card-header">
              <h2 className="card-title">Hasil Prediksi Cuaca</h2>
              <p className="card-description">
                Kondisi cuaca berdasarkan suhu dan kelembapan
              </p>
            </div>
            <div className="card-content">
              <div className="weather-breakdown">
                <h3 className="card-title">Detail Probabilitas Cuaca</h3>
                <div className="weather-grid">
                  {result.memberships.map((item) => (
                    <div key={item.set} className="weather-card">
                      <div className="weather-card-header">
                        <div
                          className={`weather-card-icon ${getWeatherIconColor(
                            item.set
                          )}`}
                        >
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
                          >
                            {getWeatherIcon(item.set)}
                          </svg>
                        </div>
                        <span className="weather-card-name">{item.set}</span>
                      </div>
                      <div className="weather-card-percentage">
                        {(item.degree * 100).toFixed(0)}%
                      </div>
                      <div className="weather-card-bar">
                        <div
                          className={`weather-card-fill ${getWeatherMembershipColor(
                            item.set
                          )}`}
                          style={{ width: `${item.degree * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card col-span-2">
            <div className="card-header">
              <h2 className="card-title">Aturan Fuzzy</h2>
              <p className="card-description">
                Aturan fuzzy yang digunakan dalam sistem
              </p>
            </div>
            <div className="card-content">
              <div className="rules-container">
                <div className="rule-item">
                  <span className="rule-number">1.</span>
                  <span className="rule-text">
                    JIKA Suhu = Sangat Panas DAN Kelembapan = Kering MAKA Cuaca
                    = Panas
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">2.</span>
                  <span className="rule-text">
                    JIKA Suhu = Panas DAN Kelembapan = Kering MAKA Cuaca = Panas
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">3.</span>
                  <span className="rule-text">
                    JIKA Suhu = Sangat Panas DAN Kelembapan = Sedang MAKA Cuaca
                    = Cerah
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">4.</span>
                  <span className="rule-text">
                    JIKA Suhu = Panas DAN Kelembapan = Sedang MAKA Cuaca = Cerah
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">5.</span>
                  <span className="rule-text">
                    JIKA Suhu = Normal DAN Kelembapan = Kering MAKA Cuaca =
                    Cerah
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">6.</span>
                  <span className="rule-text">
                    JIKA Suhu = Normal DAN Kelembapan = Sedang MAKA Cuaca =
                    Berawan
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">7.</span>
                  <span className="rule-text">
                    JIKA Suhu = Sejuk DAN Kelembapan = Sedang MAKA Cuaca =
                    Berawan
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">8.</span>
                  <span className="rule-text">
                    JIKA Suhu = Normal DAN Kelembapan = Lembab MAKA Cuaca =
                    Berawan
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">9.</span>
                  <span className="rule-text">
                    JIKA Suhu = Sejuk DAN Kelembapan = Lembab MAKA Cuaca =
                    Gerimis
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">10.</span>
                  <span className="rule-text">
                    JIKA Suhu = Dingin DAN Kelembapan = Sedang MAKA Cuaca =
                    Gerimis
                  </span>
                </div>
                <div className="rule-item">
                  <span className="rule-number">11.</span>
                  <span className="rule-text">
                    JIKA Suhu = Dingin DAN Kelembapan = Lembab MAKA Cuaca =
                    Hujan Lebat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function getWeatherIcon(condition: string) {
  switch (condition) {
    case "Panas":
      return (
        <>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </>
      );
    case "Cerah":
      return (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </>
      );
    case "Berawan":
      return (
        <>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </>
      );
    case "Gerimis":
      return (
        <>
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M8 19v1" />
          <path d="M8 14v1" />
          <path d="M16 19v1" />
          <path d="M16 14v1" />
          <path d="M12 21v1" />
          <path d="M12 16v1" />
        </>
      );
    case "Hujan Lebat":
      return (
        <>
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M16 14v6" />
          <path d="M8 14v6" />
          <path d="M12 16v6" />
        </>
      );
    default:
      return (
        <>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </>
      );
  }
}

function getWeatherIconColor(condition: string) {
  switch (condition) {
    case "Panas":
      return "text-red-600";
    case "Cerah":
      return "text-yellow-500";
    case "Berawan":
      return "text-gray-500";
    case "Gerimis":
      return "text-blue-400";
    case "Hujan Lebat":
      return "text-blue-600";
    default:
      return "text-gray-500";
  }
}

function getWeatherMembershipColor(set: string) {
  switch (set) {
    case "Panas":
      return "bg-red-600";
    case "Cerah":
      return "bg-yellow-500";
    case "Berawan":
      return "bg-gray-500";
    case "Gerimis":
      return "bg-blue-400";
    case "Hujan Lebat":
      return "bg-blue-600";
    default:
      return "bg-gray-500";
  }
}
