import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./plantComponent.css";
import { fetchPlantTextData, fetchPlantImageData } from "../../temapi";
import Thumbnail from "./Thumbnail";
import PlantDetails from "./PlantDetails";
import Gallery from "./Gallery";
import GalleryModal from "./GalleryModal";

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
          fetchPlantTextData(title, 4),
          fetchPlantImageData(title),
        ]);

        if (!textData) {
          setError(`No such "${title}" found.`);
          setPlantSections({});
        } else {
          setPlantSections(textData);
        }

        setThumbnail(imageData?.[0] || "");
        setGalleryImages(imageData?.slice(1) || []);
      } catch {
        setError("Failed to fetch plant data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [title]);

  const toggleSections = () => setShowAdditionalSections((prev) => !prev);
  const openGallery = (index) => {
    setActiveImageIndex(index);
    setGalleryOpen(true);
  };
  const closeGallery = () => setGalleryOpen(false);
  const nextImage = () =>
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () =>
    setActiveImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );

  if (loading)
    return <div className="loading-animation">Searching for {title}...</div>;

  return (
    <div className="plant-container">
      <button className="delete-button" onClick={() => onDelete(title)}>
        <span className="material-icons">delete</span>
      </button>
      <h1 className="plant-title">{title}</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <Thumbnail thumbnail={thumbnail} title={title} />
          <PlantDetails
            plantSections={plantSections}
            showAdditionalSections={showAdditionalSections}
            toggleSections={toggleSections}
          />
          <Gallery
            galleryImages={galleryImages}
            title={title}
            openGallery={openGallery}
          />
          <GalleryModal
            galleryOpen={galleryOpen}
            galleryImages={galleryImages}
            activeImageIndex={activeImageIndex}
            closeGallery={closeGallery}
            prevImage={prevImage}
            nextImage={nextImage}
          />
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
