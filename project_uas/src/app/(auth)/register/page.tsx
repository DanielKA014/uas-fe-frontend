// @ts-ignore: CSS module import without type declarations
"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
import { Form } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registerId.password !== registerId.confirm_password) {
      alert("Password and Confirm Password are not Compatible.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerId),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful!");
        setRegisterId({
          username: "",
          email: "",
          password: "",
          confirm_password: "",
        });
        router.push("/login");
      } else {
        alert(`Registration Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error Creating User", error);
      alert("An error occurred while registering. Please try again later.");
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
        <div className="container w-25 form-container py-4 d-flex flex-column align-items-center">
          <div className="mb-3">
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
            ></input>
          </div>
          <div className="mb-3">
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
            ></input>
          </div>
          <div className="mb-3">
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
            ></input>
          </div>
          <div className="mb-3">
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
            ></input>
          </div>
          <div className="mx-auto">
            <button type="submit" className="btn btn-success">
              Daftar
            </button>
          </div>
          <hr></hr>
          <a href="/login">Kembali ke halaman login</a>
        </div>
      </div>
    </Form>
  );
}
