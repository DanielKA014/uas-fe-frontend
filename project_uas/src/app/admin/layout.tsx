import React from "react";
import Sidebar from "./components/sidebar";

export const dynamic = 'force-static';
export const runtime = 'edge';
export const revalidate = 0;
export const preferredRegion = 'auto';

export const revalidateTag = false;

export const metadata = {
  title: "Admin • Ayam Bakar Ojolali",
};

export const rootLayout = true;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen m-0 p-0 bg-gray-50" style={{ fontFamily: "inherit" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main 
            style={{ 
                flex: 1, 
                marginLeft: "170px",
                transition: "margin-left 0.3s ease"
            }}
            className="p-4"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
