// @ts-ignore: CSS module import without type declarations
"use client"
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css"
import { Form } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!loginRes.ok) {
        setError('Email atau password salah!');
        setLoading(false);
        return;
      }

      const loginJson = await loginRes.json();
      const jwtToken = loginJson.token;

      if (!jwtToken) {
        setError('Email atau password salah!');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', jwtToken);

      const user = await fetch(`${BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!user.ok) {
        setError('Gagal mendapatkan user.');
        setLoading(false);
        return;
      }

      const userData = await user.json();
      
      // redirect
      if (userData.role === 'user'){
        router.push('/');
      }
      else if (userData.role === 'admin'){
        router.push('/dashboard')
      }
    } catch (err) {
      setError(`Terjadi error saat login! ${err}`);
      setLoading(false);
    }
  }

  return (
    <Form id="loginForm" onSubmit={handleLogin}>
      <div className="parent container d-flex justify-content-center align-items-center h-100" style={{ paddingTop: 64 }}>
        {loading && <LoadingSpinner fullScreen size="lg" />}
        
        {!loading && (
          <div className="form-container py-4 d-flex flex-column align-items-center">
            <div className="mb-3 w-100">
              <label htmlFor="emailForm" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="emailForm" 
                onChange={(evt) => setEmail(evt.target.value)}
                disabled={loading}
              ></input>
            </div>
            <div className="mb-3 w-100">
              <label htmlFor="passwordForm" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="passwordForm" 
                onChange={(evt) => setPassword(evt.target.value)}
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
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>  
            <hr></hr>
            <div className="d-flex justify-content-center w-100">
              <a href="/reset" className="text-primary">Lupa password?</a>
            </div>
            <span>Belum punya akun? <a href="/register" className="text-primary">Daftar disini!</a> </span>
          </div>
        )}
      </div>
    </Form>
  );
}
