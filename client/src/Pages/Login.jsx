import { useEffect, useState } from "react";
import "../css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { getUser, SanitizeInput } from "../utils/Utils";

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
    try {
      console.log(remember_me);
      const result = await fetch(
        `${import.meta.env.VITE_PATH_SERVER}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            pwd: password,
            remember_me: remember_me,
          }),
        },
      );

      const response = await result.json();

      if (response.error) setError(response.error);
      else navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="AuthContainer">
        <div className="LeftContainer Login">
          <div className="InfoContainer">
            <form onSubmit={(ev) => submitLogin(ev)}>
              <Link to="/">
                <img src="../../../img/icon.png" alt="broken" />
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
