"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          // Not authenticated
          router.replace('/login');
          return;
        }

        const data = await res.json();
        if (!data || data.role !== 'admin') {
          // Not authorized
          router.replace('/');
          return;
        }

        // Authorized
        setLoading(false);
      } catch (err) {
        console.error('Auth check failed', err);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh' }} className="justify-content-center align-item-center">
        <div>Checking permissions...</div>
      </div>
    );
  }

  return <>{children}</>;
}
