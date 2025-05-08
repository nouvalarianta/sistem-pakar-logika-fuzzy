"use client";

import { useEffect, useRef } from "react";
import { getMembershipValues, calculateFuzzyOutput } from "@/lib/fuzzy-logic";

interface TemperatureChartProps {
  currentTemperature: number;
}

export function TemperatureChart({
  currentTemperature,
}: TemperatureChartProps) {
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
    const membershipValues = getMembershipValues(10, 40, 0.5);

    // Get current membership degrees
    const result = calculateFuzzyOutput(currentTemperature);
    const currentMemberships = {
      dingin: result.memberships.find((m) => m.set === "Dingin")?.degree || 0,
      sejuk: result.memberships.find((m) => m.set === "Sejuk")?.degree || 0,
      normal: result.memberships.find((m) => m.set === "Normal")?.degree || 0,
      panas: result.memberships.find((m) => m.set === "Panas")?.degree || 0,
      sangatPanas:
        result.memberships.find((m) => m.set === "Sangat Panas")?.degree || 0,
    };

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

    for (let temp = 10; temp <= 40; temp += 5) {
      const x = chartLeft + ((temp - 10) / 30) * chartWidth;
      ctx.fillText(`${temp}°C`, x, chartBottom + 5);
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
        const temp = 10 + index * 0.5;
        const x = chartLeft + ((temp - 10) / 30) * chartWidth;
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
      membershipValues.map((v) => v.dingin),
      "#3b82f6"
    ); // Blue
    drawMembershipFunction(
      membershipValues.map((v) => v.sejuk),
      "#60a5fa"
    ); // Light blue
    drawMembershipFunction(
      membershipValues.map((v) => v.normal),
      "#22c55e"
    ); // Green
    drawMembershipFunction(
      membershipValues.map((v) => v.panas),
      "#f97316"
    ); // Orange
    drawMembershipFunction(
      membershipValues.map((v) => v.sangatPanas),
      "#ef4444"
    ); // Red

    // Draw vertical line for current temperature
    const currentX = chartLeft + ((currentTemperature - 10) / 30) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(currentX, padding);
    ctx.lineTo(currentX, chartBottom);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

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

    drawMembershipPoint(currentMemberships.dingin, "#3b82f6");
    drawMembershipPoint(currentMemberships.sejuk, "#60a5fa");
    drawMembershipPoint(currentMemberships.normal, "#22c55e");
    drawMembershipPoint(currentMemberships.panas, "#f97316");
    drawMembershipPoint(currentMemberships.sangatPanas, "#ef4444");

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

    drawLegendItem("Dingin", "#3b82f6");
    drawLegendItem("Sejuk", "#60a5fa");
    drawLegendItem("Normal", "#22c55e");
    drawLegendItem("Panas", "#f97316");
    drawLegendItem("Sangat Panas", "#ef4444");
  }, [currentTemperature]);

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} className="chart-canvas"></canvas>
    </div>
  );
}
