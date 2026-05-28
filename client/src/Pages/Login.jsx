import "../css/Auth.css";
import { Link } from "react-router-dom";

export default function Login() {
  document.title = "Login | Chatty - Chat App";
  return (
    <>
      <div className="AuthContainer">
        <div className="LeftContainer Login">
          <div className="InfoContainer">
            <form>
              <Link to="/">
                <img src="../../../img/icon.png" alt="broken" />
                Chatty
              </Link>
              <div className="Welcome">
                <h1>Welcome back</h1>
                <p>Log in to your account to continue</p>
              </div>

              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@example.com"
              />

              <label htmlFor="pwd">Password</label>
              <input
                type="password"
                name="pwd"
                id="pwd"
                placeholder="Create a password"
              />

              <div className="Check">
                <div className="Left">
                  <input type="checkbox" name="agree" id="agree" />
                  <p>Remember me</p>
                </div>
                <div className="Right">
                  <Link to="forgot-password">Forgot password?</Link>
                </div>
              </div>

              <button type="submit" className="started btn-blue">
                Log in
              </button>
            </form>

            <p>
              Don't have an account?{" "}
              <Link className="link" to="/register">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <div className="RightContainer Login">
            <div className="InfoAuth">
                <h1>Connect with your world</h1>
                <p>Fast, secure messaging that keeps you connected to the people and conversations that matter most.</p>
            </div>
        </div>
      </div>
    </>
  );
}
