"use client";

import { useEffect, useRef } from "react";
import { getHumidityMembershipValues } from "@/lib/fuzzy-logic";

interface HumidityChartProps {
  currentHumidity: number;
}

export function HumidityChart({ currentHumidity }: HumidityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Get membership values for the chart
    const membershipValues = getHumidityMembershipValues(0, 100, 1);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const chartBottom = canvas.height - padding;
    const chartLeft = padding;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(chartLeft, padding);
    ctx.lineTo(chartLeft, chartBottom);
    ctx.lineTo(chartLeft + chartWidth, chartBottom);
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw X axis labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#666";
    ctx.font = "10px Arial";

    for (let humidity = 0; humidity <= 100; humidity += 20) {
      const x = chartLeft + (humidity / 100) * chartWidth;
      ctx.fillText(`${humidity}%`, x, chartBottom + 5);
    }

    // Draw Y axis labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let degree = 0; degree <= 1; degree += 0.2) {
      const y = chartBottom - degree * chartHeight;
      ctx.fillText(degree.toFixed(1), chartLeft - 5, y);
    }

    // Draw membership functions
    const drawMembershipFunction = (values: number[], color: string) => {
      ctx.beginPath();
      values.forEach((value, index) => {
        const humidity = index;
        const x = chartLeft + (humidity / 100) * chartWidth;
        const y = chartBottom - value * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Draw each membership function
    drawMembershipFunction(
      membershipValues.map((v) => v.kering),
      "#d97706" // Amber
    );
    drawMembershipFunction(
      membershipValues.map((v) => v.sedang),
      "#059669" // Emerald
    );
    drawMembershipFunction(
      membershipValues.map((v) => v.lembab),
      "#2563eb" // Blue
    );

    // Draw vertical line for current humidity
    const currentX = chartLeft + (currentHumidity / 100) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(currentX, padding);
    ctx.lineTo(currentX, chartBottom);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Get current membership degrees
    const currentIndex = Math.round(
      (currentHumidity / 100) * membershipValues.length
    );
    const currentValues = membershipValues[currentIndex] || membershipValues[0];

    // Draw points for current membership degrees
    const drawMembershipPoint = (degree: number, color: string) => {
      if (degree > 0) {
        ctx.beginPath();
        ctx.arc(
          currentX,
          chartBottom - degree * chartHeight,
          6,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    drawMembershipPoint(currentValues.kering, "#d97706");
    drawMembershipPoint(currentValues.sedang, "#059669");
    drawMembershipPoint(currentValues.lembab, "#2563eb");

    // Draw legend
    const legendX = chartLeft + 10;
    let legendY = padding + 20;
    const legendSpacing = 25;

    const drawLegendItem = (label: string, color: string) => {
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 20, legendY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.fillText(label, legendX + 30, legendY);

      legendY += legendSpacing;
    };

    drawLegendItem("Kering", "#d97706");
    drawLegendItem("Sedang", "#059669");
    drawLegendItem("Lembab", "#2563eb");
  }, [currentHumidity]);

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} className="chart-canvas"></canvas>
    </div>
  );
  
}
