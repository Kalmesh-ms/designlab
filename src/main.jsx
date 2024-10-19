import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Navbar from "./Navbar.jsx";
import { Hero } from "./Hero.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="herosection">
      <Navbar />
      <Hero></Hero>
    </div>
  </StrictMode>
);
