"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
        const res = await fetch('http://localhost:3001/api/auth/me', {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div>Checking permissions...</div>
      </div>
    );
  }

  return <>{children}</>;
}
