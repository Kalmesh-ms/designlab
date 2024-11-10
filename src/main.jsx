import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import PlantComponent from "./Content";
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
    <PlantComponent title={"Mangifera indica"}></PlantComponent>
    <PlantComponent title={"Tulipa gesneriana"}></PlantComponent>
    <PlantComponent title={"Narcissus poeticus"}></PlantComponent>
    <PlantComponent title={"Fragaria chiloensis"}></PlantComponent>
    <PlantComponent title={"Cichorium intybus"}></PlantComponent>
    <PlantComponent title={"Betula pendula"}></PlantComponent>
  </StrictMode>
);
