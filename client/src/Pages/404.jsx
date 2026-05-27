import { Link } from "react-router-dom";
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="NotFoundContainer">
      <div className="TopHome">
        <div className="Elements">
          <img src="../../../img/icon404.png" alt="broken" />
          <h2>Page Not Found</h2>
          <p>
            Oops! The page you're looking for seems broken or removed. <br />Sorry about that! Please visit our homepage to get where you need to go.
          </p>
          <Link to="/" className="started btn-blue home">
          <Home />    Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
