import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getUser } from "../Utils/Utils";

export default function Topbar() {
  const [IsLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const isUser = await getUser();

      if (isUser) setIsLogged(true);
    };

    checkUser();
  }, []);

  return (
    <div className="Topbar">
      <div className="Leftbar">
        <Link to="/">
          <img src="../img/icon.png" alt="Chatty" />
          Chatty
        </Link>
      </div>
      <div className="Centerbar">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/features">Features</NavLink>
      </div>
      <div className="Rightbar">
        {IsLogged ? (
          <Link to="/home" className="btn-blue register">
              Home
            </Link>
        ) : (
          <>
            <Link to="/login" className="login">
              Login
            </Link>
            <Link to="/register" className="btn-blue register">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
