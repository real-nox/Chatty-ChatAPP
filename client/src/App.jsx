import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./css/App.css";
import Homepage from "./Homepage";

function App() {
  return (
    <>
      <div className="Page">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage type="home" />} />
            <Route path="/about" element={<Homepage type="about" />} ></Route>
            <Route path="/features" element={<Homepage type="features" />} ></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
