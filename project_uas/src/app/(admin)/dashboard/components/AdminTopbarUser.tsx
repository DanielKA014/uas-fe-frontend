"use client";

import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export default function AdminTopbarUser() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Error fetching admin user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push('/login');
  };

  return (
    <div style={{ position: 'absolute', top: 12, right: 20, zIndex: 20 }}>
      {!user && null}
      {user && (
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            id="admin-user-dropdown"
            className="d-flex align-items-center border-0"
            style={{ backgroundColor: 'transparent', whiteSpace: 'nowrap' }}
          >
            <Image
              src="/images/logo.png"
              alt="User Avatar"
              width={36}
              height={36}
              className="rounded-circle me-2 border"
            />
            <span style={{ fontWeight: 600 }}>{user.username}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => router.push('/profile')}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
}
