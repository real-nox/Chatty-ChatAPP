import { Link, NavLink } from "react-router-dom";

export default function Topbar() {
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
        <Link to="/login" className="login">
          Login
        </Link>
        <Link to="/register" className="btn-blue register">
          Sign up
        </Link>
      </div>
    </div>
  );
}
