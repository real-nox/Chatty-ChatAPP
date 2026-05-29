import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function HomeCenter() {
  useEffect(() => {
    document.title = "Chatty - Chat App";
  }, []);

  return (
    <>
      <div className="TopHome">
        <div className="Elements">
          <h1>
            Connect with Anyone, <br /> Anywhere
          </h1>
          <p>
            Fast, secure, and reliable messaging for teams and individuals. Stay
            connected with the people who matter most.
          </p>

          <Link to="/register" className="started btn-blue">
            Get started
          </Link>
        </div>
      </div>
      <div className="Whychoose">
        <h1>Why Choose Chatty?</h1>
        <br />
        <p>Everything you need for seamless communication</p>
        <div className="List">
          <div className="item">
            <h3>Lightning Fast</h3>
            <p>
              Messages delivered in milliseconds. Experience real-time
              communication without delays.
            </p>
          </div>
          <div className="item">
            <h3>End-to-End Encryption</h3>
            <p>Your conversations are private and secure.</p>
          </div>

          <div className="item">
            <h3>Privacy First</h3>
            <p>We never sell your data. Your privacy is our top priority.</p>
          </div>
        </div>
      </div>
    </>
  );
}
