// @ts-ignore: CSS module import without type declarations
"use client"
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css"
import { Form } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: { preventDefault: () => void; }) {
    e.preventDefault();
    try {
      const loginRes = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!loginRes.ok) {
        alert('Email atau password salah!');
        return;
      }

      const loginJson = await loginRes.json();
      const jwtToken = loginJson.token;

      // console.log(loginJson);

      if (!jwtToken) {
        alert('Email atau password salah!');
        return;
      }

      localStorage.setItem('token', jwtToken);
      // console.log('Token:', jwtToken);

      const user = await fetch('http://localhost:3001/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!user.ok) {
        alert('Gagal mendapatkan user.');
        return;
      }

      const userData = await user.json();
      // console.log('Current User', userData);
      // console.log('User role', userData.role)
      // redirect
      if (userData.role === 'user'){
        router.push('/');
      }
      else if (userData.role === 'admin'){
        router.push('/dashboard')
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi error saat login!');
    }
  }

  return (
    <Form id="loginForm" onSubmit={handleLogin}>
      <div className="parent container d-flex justify-content-center align-items-center h-100">
        <div className="container w-25 form-container py-4 d-flex flex-column align-items-center">
          <div className="mb-3">
            <label htmlFor="emailForm" className="form-label">Email</label>
            <input type="email" className="form-control" id="emailForm" 
              onChange={(evt) => setEmail(evt.target.value)}
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordForm" className="form-label">Password</label>
            <input type="password" className="form-control" id="passwordForm" 
              onChange={(evt) => setPassword(evt.target.value)}
            ></input>
          </div>
          <div className="mx-auto">
            <button type="submit" className="btn btn-success">Login</button>
          </div>  
          <hr></hr>
          <div className="d-flex justify-content-start">
              <a href="/reset">Lupa password?</a> 
          </div>
          <span>Belum punya akun? <a href="/register">Daftar disini!</a> </span>
        </div>
      </div>
    </Form>
  );
}
