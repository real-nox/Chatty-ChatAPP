import { createRoot } from "react-dom";
import { StrictMode } from "react";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
