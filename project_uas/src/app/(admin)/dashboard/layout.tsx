import React from "react";
import AdminGuard from "./components/AdminGuard";

export const dynamic = 'force-dynamic';
export const metadata = {
  title: "Admin • Ayam Bakar Ojolali",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <main style={{ flex: 1, minHeight: '100vh', paddingTop: 64, width: '100%', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
