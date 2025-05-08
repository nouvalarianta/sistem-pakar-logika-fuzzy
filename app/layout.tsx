import type React from "react";
import "./styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistem Pakar Kondisi Suhu Ruangan",
  description:
    "Sistem pakar untuk klasifikasi kondisi suhu ruangan menggunakan metode fuzzy Sugeno",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
