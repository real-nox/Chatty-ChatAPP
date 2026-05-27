import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="Top">
        <div className="PartTopFooter">
          <div className="topPart">
            <Link to="/">
              <img src="../img/icon.png" alt="Chatty" />
              Chatty
            </Link>
          </div>
          <div className="centerPart">
            <p>Connect with anyone, anywhere. Fast, secure, and reliable messaging.</p>
          </div>
        </div>
        <div className="PartTopFooter">
          <div className="topPart"><h3>Product</h3></div>
          <div className="centerPart"></div>
        </div>
        <div className="PartTopFooter">
          <div className="topPart"><h3>Company</h3></div>
          <div className="centerPart"></div>
        </div>
        <div className="PartTopFooter">
          <div className="topPart"><h3>Legal</h3></div>
          <div className="centerPart"></div>
        </div>
      </div>
      <div className="Bottom">
        <p>&copy; 2026 Chatty. All rights reserved.</p>
      </div>
    </footer>
  );
}
