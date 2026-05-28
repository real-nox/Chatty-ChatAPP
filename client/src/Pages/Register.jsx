import "../css/Auth.css";
import { Link } from "react-router-dom";

export default function Register() {
  document.title = "Sign in | Chatty - Chat App";
  return (
    <>
      <div className="AuthContainer">
        <div className="LeftContainer Register">
            <div className="InfoAuth">
                <h1>Start your journey</h1>
                <p>Join users and experience the future of communication.</p>
            </div>
        </div>
        <div className="RightContainer Register">
          <div className="InfoContainer">
            <form>
              <Link to="/">
                <img src="../../../img/icon.png" alt="broken" />
                Chatty
              </Link>
              <div className="Welcome">
                <h1>Create an account</h1>
                <p>Get started with your free account</p>
              </div>

              <label htmlFor="display_name">Display name</label>
              <input
                type="text"
                name="display_name"
                id="display_name"
                placeholder="Ranox"
                maxLength="20"
              />

              <label htmlFor="username" id="CheckingUsername"></label>
              <label htmlFor="username" id="username">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="real_ranox"
              />

              <label htmlFor="email">Email address</label>
              <label htmlFor="email" id="CheckingEmail"></label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@example.com"
              />

              <label htmlFor="pwd">Password</label>
              <label htmlFor="pwd" id="CheckingPWD"></label>
              <input
                type="password"
                name="pwd"
                id="pwd"
                placeholder="Create a password"
              />

              <label htmlFor="passwordCheck">Confirm Password</label>
              <label htmlFor="passwordCheck" id="CheckingPassword"></label>
              <input
                type="password"
                name="passwordCheck"
                id="passwordCheck"
                placeholder="Confirm your password"
              />

              <div className="Check">
                <input type="checkbox" name="agree" id="agree" />
                <p>I agree to the Terms of Service and Privacy Policy</p>
              </div>

              <button type="submit" className="started btn-blue">Create account</button>
            </form>

            <p>
              Already have an account? <Link className="link" to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
