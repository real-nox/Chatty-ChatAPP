import { Link } from "react-router-dom";
import Logo from "../assets/icon.png";

export default function Footer() {
  return (
    <footer>
      <div className="Top">
        <div className="PartTopFooter">
          <div className="topPart">
            <Link to="/">
              <img src={Logo} alt="Chatty" />
              <h3>Chatty</h3>
            </Link>
          </div>
          <div className="centerPart">
            <p>
              Connect with anyone, anywhere. Fast, secure, and reliable
              messaging.
            </p>
          </div>
        </div>
        <div className="PartTopFooter">
          <div className="topPart">
            <h3>Product</h3>
          </div>
          <div className="centerPart">
            <Link to="/features">Features</Link>
          </div>
        </div>
        <div className="PartTopFooter">
          <div className="topPart">
            <h3>Company</h3>
          </div>
          <div className="centerPart">
            <Link to="/about">About us</Link>
          </div>
        </div>
        <div className="PartTopFooter">
          <div className="topPart">
            <h3>Legal</h3>
          </div>
          <div className="centerPart">
            <Link>Privacy Policy</Link>
            <Link>Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="Bottom">
        <p>&copy; 2026 Chatty. All rights reserved.</p>
      </div>
    </footer>
  );
}
