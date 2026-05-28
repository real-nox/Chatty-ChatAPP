import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./css/App.css";
import Homepage from "./Homepage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

function App() {
  return (
    <>
      <div className="Page">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage type="home" />} />
            <Route path="/about" element={<Homepage type="about" />} ></Route>
            <Route path="/features" element={<Homepage type="features" />} ></Route>
            
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>

            <Route path="*" element={<Homepage type="404" />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
