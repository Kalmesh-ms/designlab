import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Navbar from "./Navbar.jsx";
import App from "./App.jsx";
// import Hero from "./Hero.jsx";

const Main = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Store the search term
  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term); // Save search term
    setIsSearchMode(true); // Switch to App interface
  };

  return (
    <>
      {!isSearchMode ? (
        <div className="maincontainer ">
          <Navbar onSearch={handleSearch} />
          <div className="heroText poppins-extrabold">
            <p className="darker">Learn,</p>
            <p className="dark">Explore,</p>
            <p className="light">and Value</p>
          </div>
          <p className="small poppins-light">the magnificent diversity</p>
          <p className="small poppins-light">of the plant kingdom</p>
          <p className="empty-list-message smaller white poppins-extralight">
            ---Search plants to display---
          </p>
        </div>
      ) : (
        <div className="search-app">
          <Navbar onSearch={handleSearch} />
          <App searchQuery={searchTerm} />
        </div>
      )}
    </>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Main /> {/* Main is now reusable */}
  </StrictMode>
);
