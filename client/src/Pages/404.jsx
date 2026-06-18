import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useEffect } from "react";

import Icon404 from "../assets/icon404.png";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 | Chatty - Chat App";
  }, []);

  return (
    <div className="NotFoundContainer">
      <div className="TopHome">
        <div className="Elements">
          <img src={Icon404} alt="broken Chatty" />
          <h2>Page Not Found</h2>
          <p>
            Oops! The page you're looking for seems broken or removed. <br />
            Sorry about that! Please visit our homepage to get where you need to
            go.
          </p>
          <Link to="/" className="started btn-blue home">
            <Home /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
