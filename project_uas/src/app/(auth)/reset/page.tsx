// @ts-ignore: CSS module import without type declarations
"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css"
import { Form } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !newPassword || !confirmPassword) {
      setError("Semua field harus diisi");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sesuai");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          new_password: newPassword,
          confirm_new_password: confirmPassword,
        }),
      });

      if (response.ok) {
        setSuccess("Password berhasil diubah! Silakan login dengan password baru Anda.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Gagal mengubah password");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Terjadi kesalahan saat mengubah password");
      setLoading(false);
    }
  };

  return (
    <Form id="resetForm" onSubmit={handleSubmit}>
      <div className="parent container d-flex justify-content-center align-items-center h-100" style={{ marginTop: 64 }}>
        {loading && <LoadingSpinner fullScreen size="lg" />}
        
        {!loading && (
          <div className="container w-100 w-md-75 w-lg-25 form-container py-4 d-flex flex-column align-items-center">
            <div className="mb-3 w-100">
              <label htmlFor="emailForm" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="emailForm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              ></input>
            </div>
            <div className="mb-3 w-100">
              <label htmlFor="passwordForm" className="form-label">Password Baru</label>
              <input 
                type="password" 
                className="form-control" 
                id="passwordForm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              ></input>
            </div>
            <div className="mb-3 w-100">
              <label htmlFor="confirmPasswordForm" className="form-label">Konfirmasi Password Baru</label>
              <input 
                type="password" 
                className="form-control" 
                id="confirmPasswordForm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              ></input>
            </div>

            {error && (
              <div className="alert alert-danger w-100" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success w-100" role="alert">
                {success}
              </div>
            )}
            
            <div className="mx-auto">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Loading...' : 'Ubah Password'}
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
