import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import "./index.css";
// import PlantComponent from "./Content";
// import Navbar from "./Navbar.jsx";
// import { Hero } from "./Hero.jsx";
// import { Explore } from "./Explore.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <div className="maincontainer">
      <div className="herosection">
        <Navbar />
        <Hero></Hero>
      </div>
      <Explore></Explore>
    </div> */}
    <App></App>
  </StrictMode>
);
