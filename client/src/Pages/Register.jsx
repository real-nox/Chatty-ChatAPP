import { useState } from "react";
import "../css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { SanitizeInput } from "../Utils/Utils";

export default function Register() {
  const [displayn, setDisplayn] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [accept, setAccept] = useState(false);

  const [error, setError] = useState({});
  const [valid, setValid] = useState({
    password: false,
    username: false,
    pwdcheck: false,
    loading: true,
  });

  const navigate = useNavigate();

  document.title = "Sign in | Chatty - Chat App";

  const username_special_char_reg = /^[a-zA-Z0-9._-]+$/;
  const special_char_reg = /[!@#$%^&*()\-_=+\[\]{};':",.<>/?\\|]/;
  const num_range_reg = /[0-9]/;
  const cap_letters_char = /[A-Z]/;
  const low_letters_char = /[a-z]/;

  const checkUsername = (content) => {
    let str = SanitizeInput(content);
    setUsername(str);

    if (!username_special_char_reg.test(str)) {
      setError((oldData) => ({
        ...oldData,
        ["username_err"]: "Only letters, numbers, . _ - allowed",
      }));
    } else {
      setError((old) => {
        const { ["username_err"]: _, ...rest } = old;
        return rest;
      });
      setValid((prev) => ({ ...prev, username: true }));
    }
  };

  const checkPWD = (content) => {
    const chars = SanitizeInput(content);
    setPassword(chars);

    const points = {
      capital_l: false,
      lower_l: false,
      special_char_included: false,
      numbers: false,
    };

    if (cap_letters_char.test(chars)) {
      points.capital_l = true;
    } else {
      points.capital_l = false;
    }

    if (low_letters_char.test(chars)) {
      points.lower_l = true;
    } else {
      points.lower_l = false;
    }

    if (special_char_reg.test(chars)) {
      points.special_char_included = true;
    } else {
      points.special_char_included = false;
    }

    if (num_range_reg.test(chars)) {
      points.numbers = true;
    } else {
      points.numbers = false;
    }

    const score = Object.values(points).filter(Boolean).length;
    let res = "";

    if (chars.length < 5) {
      res = "Weak password";
      setValid((prev) => ({ ...prev, password: false }));
    } else {
      switch (score) {
        case 1:
          res = "Weak password";
          setValid((prev) => ({ ...prev, password: false }));
          break;

        case 2:
          res = "Medium password";
          setValid((prev) => ({ ...prev, password: false }));
          break;

        case 3:
          res = "Good password";
          setValid((prev) => ({ ...prev, password: false }));
          break;

        case 4:
          res = "Strong password";
          setValid((prev) => ({ ...prev, password: true }));
          break;
      }

      setError((prev) => ({
        ...prev,
        ["pwd_err"]: res,
      }));
    }
  };

  const checkPWD2 = (content) => {
    const str = SanitizeInput(content);
    setPasswordCheck(str);

    if (str == password) {
      setValid((prev) => ({ ...prev, pwdcheck: true }));
      setError((prev) => {
        const { ["pwdCheck"]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setValid((prev) => ({ ...prev, pwdcheck: false }));
      setError((prev) => ({
        ...prev,
        ["pwdCheck"]: "Password are not matched",
      }));
    }
  };

  const submitRegister = async (ev) => {
    try {
      ev.preventDefault();
      const result = await fetch(
        `${import.meta.env.VITE_PATH_SERVER}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            display_name: displayn,
            email: email,
            pwd: password,
            passwordCheck: passwordCheck,
          }),
        },
      );

      const response = await result.json();

      setValid((prev) => ({
        ...prev,
        loading: false,
      }));

      if (response.error) {
        setError((prev) => ({
          ...prev,
          ["server"]: response.error,
        }));

        setValid((prev) => ({
          ...prev,
          loading: true,
        }));
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };
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
            <form onSubmit={(ev) => submitRegister(ev)}>
              <Link to="/">
                <img src="../../../img/icon.png" alt="Chatty" />
                Chatty
              </Link>
              <div className="Welcome">
                <h1>Create an account</h1>
                <p>Get started with your free account</p>
              </div>
              {error["server"] ? (
                <span className="errorP server">{error["server"]}</span>
              ) : null}

              <label htmlFor="display_name">Display name</label>
              <input
                type="text"
                name="display_name"
                id="display_name"
                placeholder="Ranox"
                maxLength="20"
                onInput={(ev) => setDisplayn(ev.target.value)}
              />

              <label className="labels" htmlFor="username" id="username">
                Username
                {error["username_err"] ? (
                  <span className="errorP">{error["username_err"]}</span>
                ) : null}
              </label>

              <input
                type="text"
                name="username"
                id="username"
                placeholder="real_ranox"
                onInput={(ev) => checkUsername(ev.target.value)}
              />

              <label htmlFor="email">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@example.com"
                onInput={(ev) => setEmail(ev.target.value)}
              />

              <label htmlFor="pwd" className="labels">
                Password
                {error["pwd_err"] ? (
                  <span className={`errorP ${error["pwd_err"]}`}>
                    {error["pwd_err"]}
                  </span>
                ) : null}
              </label>
              <input
                type="password"
                name="pwd"
                id="pwd"
                placeholder="Create a password"
                onInput={(ev) => checkPWD(ev.target.value)}
              />

              <label htmlFor="passwordCheck" className="labels">
                Confirm Password
                {error["pwdC_err"] ? (
                  <span className={`errorP ${error["pwdC_err"]}`}>
                    {error["pwdC_err"]}
                  </span>
                ) : null}
              </label>
              <input
                type="password"
                name="passwordCheck"
                id="passwordCheck"
                placeholder="Confirm your password"
                onInput={(ev) => checkPWD2(ev.target.value)}
              />
              {error["pwdCheck"] ? (
                <label htmlFor="passwordCheck">{error["pwdCheck"]}</label>
              ) : null}

              <div className="Check">
                <input
                  type="checkbox"
                  name="agree"
                  id="agree"
                  onClick={() => (accept ? setAccept(false) : setAccept(true))}
                />
                <p>I agree to the Terms of Service and Privacy Policy</p>
              </div>

              <button
                type="submit"
                className="started btn-blue"
                disabled={
                  !valid.password ||
                  !valid.pwdcheck ||
                  !valid.username ||
                  !accept ||
                  !valid.loading
                }
              >
                Create account
              </button>
            </form>

            <p>
              Already have an account?
              <Link className="link" to="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
