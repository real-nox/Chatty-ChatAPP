import { SanitizeInput } from "../Utils/Utils.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "../assets/icon.png";
import "../css/Auth.css";
import { getUser, login } from "../api/User.api.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember_me, setRemember_me] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | Chatty - Chat App";

    const checkUser = async () => {
      const isUser = await getUser();

      if (isUser) navigate("/home");
    };

    checkUser();
  }, []);

  const submitLogin = async (ev) => {
    ev.preventDefault();
    const response = await login(email, password, remember_me);

    if (response.error) setError(response.error);
    else navigate("/home");
  };

  return (
    <>
      <div className="AuthContainer">
        <div className="LeftContainer Login">
          <div className="InfoContainer">
            <form onSubmit={(ev) => submitLogin(ev)}>
              <Link to="/">
                <img src={Avatar} alt="broken" />
                Chatty
              </Link>
              <div className="Welcome">
                <h1>Welcome back</h1>
                <p>Log in to your account to continue</p>
              </div>

              {error ? <span className="errorP server">{error}</span> : null}

              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@example.com"
                onInput={(ev) => setEmail(SanitizeInput(ev.target.value))}
              />

              <label htmlFor="pwd">Password</label>
              <input
                type="password"
                name="pwd"
                id="pwd"
                placeholder="Enter your password"
                onInput={(ev) => setPassword(SanitizeInput(ev.target.value))}
              />

              <div className="Check">
                <div className="Left">
                  <input
                    type="checkbox"
                    name="agree"
                    id="agree"
                    onClick={() =>
                      remember_me ? setRemember_me(false) : setRemember_me(true)
                    }
                  />
                  <label htmlFor="agree">Remember me</label>
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
            <p>
              Fast, secure messaging that keeps you connected to the people and
              conversations that matter most.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
