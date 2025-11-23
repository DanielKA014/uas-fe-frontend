import React from "react";
import AdminGuard from "./components/AdminGuard";

export const dynamic = 'force-static';
export const runtime = 'edge';
export const revalidate = 0;
export const preferredRegion = 'auto';

export const metadata = {
  title: "Admin • Ayam Bakar Ojolali",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  );
}
