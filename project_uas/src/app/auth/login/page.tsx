// @ts-ignore: CSS module import without type declarations
import "bootstrap/dist/css/bootstrap.min.css";
import "../../auth/styles.css"

export default function Login() {
  return (

    <div className="parent container d-flex justify-content-center align-items-center h-100">
      <div className="container w-25 form-container py-4 d-flex flex-column align-items-center">
        <div className="mb-3">
          <label htmlFor="emailForm" className="form-label">Email</label>
          <input type="email" className="form-control" id="emailForm" ></input>
        </div>
        <div className="mb-3">
          <label htmlFor="passwordForm" className="form-label">Password</label>
          <input type="text" className="form-control" id="passwordForm" ></input>
        </div>
        <div className="mx-auto">
          <button type="button" className="btn btn-success">Login</button>
        </div>
        <hr></hr>
        <div className="d-flex justify-content-start">
             <a href="/auth/reset">Lupa password?</a> 
        </div>
        <span>Belum punya akun? <a href="/auth/register">Daftar disini!</a> </span>
      </div>
    </div>

  );
}
