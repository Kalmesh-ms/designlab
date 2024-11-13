// App.js

import { useState } from "react";
import PlantComponent from "./Content";
import SearchBar from "./SearchBar";
import "./app.css";

const App = () => {
  const [plants, setPlants] = useState([]);

  const handleSearch = (title) => {
    // Check if the plant is already in the list
    if (plants.includes(title)) {
      alert(`"${title}" is already displayed.`);
      return;
    }

    setPlants((prevPlants) => [title, ...prevPlants]);
  };

  const handleDelete = (titleToDelete) => {
    setPlants((prevPlants) =>
      prevPlants.filter((title) => title !== titleToDelete)
    );
  };

  return (
    <div className="app-container">
      <SearchBar onSearch={handleSearch} />
      <div className="plants-list">
        {plants.map((title) => (
          <PlantComponent key={title} title={title} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default App;
