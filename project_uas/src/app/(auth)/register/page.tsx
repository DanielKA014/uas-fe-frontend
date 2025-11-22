// @ts-ignore: CSS module import without type declarations
"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import { Form } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function Register() {
  const [registerId, setRegisterId] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (registerId.password !== registerId.confirm_password) {
      setError("Password dan Konfirmasi Password tidak sesuai.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerId),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pendaftaran berhasil!");
        setRegisterId({
          username: "",
          email: "",
          password: "",
          confirm_password: "",
        });
        router.push("/login");
      } else {
        setError(`Pendaftaran gagal: ${data.message || 'Silakan coba lagi'}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error Creating User", error);
      setError("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setRegisterId((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <Form id="registerForm" onSubmit={handleSubmit}>
      <div className="parent container d-flex justify-content-center align-items-center h-100">
        {loading && <LoadingSpinner fullScreen size="lg" />}
        
        {!loading && (
          <div className="container w-100 w-md-75 w-lg-25 form-container py-4 d-flex flex-column align-items-center">
            <div className="mb-3 w-100">
              <label htmlFor="usernameForm" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={registerId.username}
                onChange={handleChange}
                required
                disabled={loading}
              ></input>
            </div>
            <div className="mb-3 w-100">
              <label htmlFor="emailForm" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={registerId.email}
                onChange={handleChange}
                required
                disabled={loading}
              ></input>
            </div>
            <div className="mb-3 w-100">
              <label htmlFor="passwordForm" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={registerId.password}
                onChange={handleChange}
                required
                disabled={loading}
              ></input>
            </div>
            <div className="mb-3 w-100">
              <label htmlFor="confirmPasswordForm" className="form-label">
                Konfirmasi Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirm_password"
                value={registerId.confirm_password}
                onChange={handleChange}
                required
                disabled={loading}
              ></input>
            </div>
            
            {error && (
              <div className="alert alert-danger w-100" role="alert">
                {error}
              </div>
            )}
            
            <div className="mx-auto">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Loading...' : 'Daftar'}
              </button>
            </div>
            <hr></hr>
            <a href="/login">Kembali ke halaman login</a>
          </div>
        )}
      </div>
    </Form>
  );
}
