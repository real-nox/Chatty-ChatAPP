import { Link } from "react-router-dom";

export default function HomeCenter() {
  return (
    <>
      <div className="TopHome">
        <div className="Elements">
          <h1>Connect with Anyone, <br /> Anywhere</h1>
          <p>Fast, secure, and reliable messaging for teams and individuals. Stay connected with the people who matter most.</p>

          <Link to="/register" className="started btn-blue">Get started</Link>
        </div>
      </div>
      
    </>
  );
}
