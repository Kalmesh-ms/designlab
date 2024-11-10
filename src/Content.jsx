// PlantComponent.js

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./content.css";
import { fetchPlantTextData, fetchPlantImageData } from "./temapi";

const PlantComponent = ({ title, onDelete }) => {
  const [plantSections, setPlantSections] = useState({});
  const [thumbnail, setThumbnail] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [textData, imageData] = await Promise.all([
          fetchPlantTextData(title),
          fetchPlantImageData(title),
        ]);

        if (textData === null) {
          setError(`No such "${title}" found.`);
          setPlantSections({});
        } else {
          setPlantSections(textData);
        }

        if (imageData && imageData.length > 0) {
          setThumbnail(imageData[0]); // Use the first image as the thumbnail
          setGalleryImages(imageData.slice(1)); // Use remaining images for the gallery
        } else {
          setGalleryImages([]);
        }
      } catch (err) {
        setError("Failed to fetch plant data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [title]);

  if (loading) {
    return <div className="loading-animation">Loading...</div>;
  }

  return (
    <div className="plant-container">
      <button className="delete-button" onClick={() => onDelete(title)}>
        &times;
      </button>
      <h1 className="plant-title">{title}</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {thumbnail && (
            <div className="thumbnail-container">
              <img
                src={`https://en.wikipedia.org/wiki/Special:FilePath/${thumbnail}`}
                alt={`${title} thumbnail`}
                className="thumbnail-image"
              />
            </div>
          )}

          <div className="content">
            {/* Render each section individually */}
            {Object.entries(plantSections).map(
              ([sectionTitle, sectionContent]) => (
                <div key={sectionTitle} className="section">
                  <h2>{sectionTitle.replace(/_/g, " ")}</h2>
                  <pre className="text-content">{sectionContent}</pre>
                </div>
              )
            )}
          </div>

          {galleryImages.length > 0 && (
            <div className="gallery-container">
              <h2>Gallery</h2>
              <div className="gallery">
                {galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={`https://en.wikipedia.org/wiki/Special:FilePath/${image}`}
                    alt={`${title} gallery image ${index + 1}`}
                    className="gallery-image"
                    loading="lazy" // Lazy load gallery images for performance
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

PlantComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PlantComponent;
