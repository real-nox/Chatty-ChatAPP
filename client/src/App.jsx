import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Pages/register.jsx";
import Homepage from "./homepage.jsx";
import Login from "./Pages/login.jsx";
import Home from "./Pages/home.jsx";
import "./css/App.css";

function App() {
  return (
    <>
      <div className="Page">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage type="home" />} />
            <Route path="/about" element={<Homepage type="about" />}></Route>
            <Route
              path="/features"
              element={<Homepage type="features" />}
            ></Route>

            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>

            <Route path="/home" element={<Home />}></Route>

            <Route path="*" element={<Homepage type="404" />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
