// @ts-ignore: CSS module import without type declarations
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css"
import { Form } from "react-bootstrap";

export default function Register() {
  return (
    <Form id="registerForm">
      <div className="parent container d-flex justify-content-center align-items-center h-100">
        <div className="container w-25 form-container py-4 d-flex flex-column align-items-center">
          <div className="mb-3">
            <label htmlFor="usernameForm" className="form-label">Nama Anda</label>
            <input type="text" className="form-control" id="usernameForm" ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="emailForm" className="form-label">Email</label>
            <input type="email" className="form-control" id="emailForm" ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordForm" className="form-label">Password</label>
            <input type="password" className="form-control" id="passwordForm" ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPasswordForm" className="form-label">Konfirmasi Password</label>
            <input type="password" className="form-control" id="confirmPasswordForm" ></input>
          </div>
          <div className="mx-auto">
            <button type="submit" className="btn btn-success">Daftar</button>
          </div>
          <hr></hr>
          <a href="/login">Kembali ke halaman login</a>
        </div>
      </div>
    </Form>
  );
}
