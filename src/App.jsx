import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import PlantComponent from "./Content";
import "./app.css";

const App = ({ searchQuery }) => {
  const [plants, setPlants] = useState([]);

  // Search function to add plants (prevents duplicates)
  const handleSearch = useCallback(
    (title) => {
      setPlants((prevPlants) => {
        if (prevPlants.includes(title)) {
          alert(`"${title}" is already displayed.`);
          return prevPlants; // Return the same state if duplicate
        }
        return [title, ...prevPlants]; // Add new title
      });
    },
    [] // No external dependencies required
  );

  // Automatically process the searchQuery if provided
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery); // Use the updated handleSearch
    }
  }, [searchQuery, handleSearch]); // Add handleSearch as dependency

  // Delete function to remove a plant
  const handleDelete = useCallback((titleToDelete) => {
    setPlants((prevPlants) =>
      prevPlants.filter((title) => title !== titleToDelete)
    );
  }, []);

  return (
    <div className="app-container">
      {plants.length === 0 ? (
        <p className="empty-list-message small white poppins-bold">
          Search plants to display
        </p>
      ) : (
        <div className="plants-list">
          {plants.map((title) => (
            <PlantComponent key={title} title={title} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

// Prop Validation
App.propTypes = {
  searchQuery: PropTypes.string.isRequired, // Validate that searchQuery is a required string
};

export default App;
