import React from "react";
import Sidebar from "./components/sidebar";
import AdminGuard from "./components/AdminGuard";

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
            <AdminGuard>
              {children}
            </AdminGuard>
        </div>
      </body>
    </html>
  );
}
