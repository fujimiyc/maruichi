import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ユースセンター まるいち - 入退室管理",
  description: "ユースセンターまるいちの入退室管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 min-h-screen">
        <div className="max-w-[430px] mx-auto bg-white min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
