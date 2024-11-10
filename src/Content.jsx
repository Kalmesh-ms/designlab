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
  const [showAdditionalSections, setShowAdditionalSections] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [textData, imageData] = await Promise.all([
          fetchPlantTextData(title, 4), // Fetch only the first 4 sections
          fetchPlantImageData(title),
        ]);

        if (textData === null) {
          setError(`No such "${title}" found.`);
          setPlantSections({});
        } else {
          setPlantSections(textData);
        }

        if (imageData && imageData.length > 0) {
          setThumbnail(imageData[0]);
          setGalleryImages(imageData.slice(1));
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

  const toggleSections = () => {
    setShowAdditionalSections((prev) => !prev);
  };

  const openGallery = (index) => {
    setActiveImageIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const nextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + galleryImages.length) % galleryImages.length
    );
  };

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
                onClick={() => openGallery(0)}
              />
            </div>
          )}

          <div className="content">
            {plantSections["description"] && (
              <div className="section">
                <h2>Description</h2>
                <pre className="text-content">
                  {plantSections["description"]}
                </pre>
              </div>
            )}

            <button
              className="expand-button large-button"
              onClick={toggleSections}
            >
              {showAdditionalSections ? "Hide Details" : "Show More Details"}
            </button>

            {showAdditionalSections && (
              <>
                {Object.entries(plantSections)
                  .slice(1, 4) // Show only the first 4 sections after description
                  .map(([sectionTitle, sectionContent]) => (
                    <div key={sectionTitle} className="section">
                      <h2>{sectionTitle.replace(/_/g, " ")}</h2>
                      <pre className="text-content">{sectionContent}</pre>
                    </div>
                  ))}
              </>
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
                    loading="lazy"
                    onClick={() => openGallery(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {galleryOpen && (
            <div className="gallery-modal">
              <button className="close-button" onClick={closeGallery}>
                &times;
              </button>
              <img
                src={`https://en.wikipedia.org/wiki/Special:FilePath/${galleryImages[activeImageIndex]}`}
                alt={`Gallery Image ${activeImageIndex + 1}`}
                className="modal-image"
              />
              <button className="prev-button" onClick={prevImage}>
                &lt;
              </button>
              <button className="next-button" onClick={nextImage}>
                &gt;
              </button>
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
