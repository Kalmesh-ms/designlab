import PropTypes from "prop-types"; // Import PropTypes for validation
import { useState } from "react";
import "./Navbar.css";

function Navbar({ onSearch }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim() === "") {
      alert("Please enter a search term!");
      return;
    }
    onSearch(searchInput); // Pass the search input to the parent
    setSearchInput(""); // Clear the input
  };

  return (
    <>
      <div className="navbar flex-column space-btw grow-1">
        <div className="logo flex-column grow-2 align-center poppins-bold">
          PLANT KINGDOM
        </div>

        <div className="nav-links flex-column jend grow-1 align-center">
          <div>
            <a href="#" className="links">
              EXPLORE
            </a>
          </div>
          <div>
            <a href="#" className="links">
              LEARN
            </a>
          </div>
          <div>
            <a href="#" className="links">
              ARTICLES
            </a>
          </div>
          <div>
            <a href="#" className="links">
              DOCS
            </a>
          </div>
          <div className="flex-column search-div">
            <input
              className="input-search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)} // Update search input
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter
            />
            <span
              className="material-icons md-24 search-btn"
              onClick={handleSearch} // Trigger search on button click
            >
              search
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// Add Prop Validation
Navbar.propTypes = {
  onSearch: PropTypes.func.isRequired, // Validate onSearch prop
};

export default Navbar;
