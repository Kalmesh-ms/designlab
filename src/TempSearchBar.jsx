// TempSearchBar.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { fetchPlantTextData, fetchPlantImageData } from "./temapi";

const TempSearchBar = ({ onResult }) => {
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch plant text and image data using React Query
  const {
    data: textData,
    isLoading: textLoading,
    error: textError,
  } = useQuery(
    ["plantTextData", searchQuery],
    () => fetchPlantTextData(searchQuery),
    {
      enabled: !!searchQuery, // Only run query if searchQuery has value
      staleTime: 1000 * 60 * 10, // Cache results for 10 minutes
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: imageData,
    isLoading: imageLoading,
    error: imageError,
  } = useQuery(
    ["plantImageData", searchQuery],
    () => fetchPlantImageData(searchQuery),
    {
      enabled: !!searchQuery,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput) {
      setSearchQuery(trimmedInput);
      setInput("");
    }
  };

  // Send result to parent component once data is available
  React.useEffect(() => {
    if (textData && imageData) {
      onResult({ title: searchQuery, textData, imageData });
    }
  }, [textData, imageData, searchQuery, onResult]);

  return (
    <form className="temp-search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter plant name"
        className="search-input"
      />
      <button
        type="submit"
        className="search-button"
        disabled={textLoading || imageLoading}
      >
        {textLoading || imageLoading ? "Loading..." : "Search"}
      </button>
      {textError && <p>Error loading text data.</p>}
      {imageError && <p>Error loading images.</p>}
    </form>
  );
};

TempSearchBar.propTypes = {
  onResult: PropTypes.func.isRequired,
};

export default TempSearchBar;
