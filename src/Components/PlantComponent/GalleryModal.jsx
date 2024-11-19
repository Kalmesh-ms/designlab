import { useEffect } from "react";
import PropTypes from "prop-types";

const GalleryModal = ({
  galleryOpen,
  galleryImages,
  activeImageIndex,
  closeGallery,
  prevImage,
  nextImage,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeGallery();
    };

    if (galleryOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [galleryOpen, nextImage, prevImage, closeGallery]);

  return (
    galleryOpen && (
      <div
        className="gallery-modal"
        onClick={(e) => e.target === e.currentTarget && closeGallery()}
      >
        <button className="close-button right" onClick={closeGallery}>
          <span className="material-icons modal-btn">close</span>
        </button>
        <img
          src={`https://en.wikipedia.org/wiki/Special:FilePath/${galleryImages[activeImageIndex]}`}
          alt={`Gallery Image ${activeImageIndex + 1}`}
          className="modal-image"
        />
        <button
          className="prev-button"
          onClick={prevImage}
          disabled={galleryImages.length <= 1}
        >
          <span className="material-icons modal-btn">arrow_back</span>
        </button>
        <button
          className="next-button right"
          onClick={nextImage}
          disabled={galleryImages.length <= 1}
        >
          <span className="material-icons modal-btn">arrow_forward</span>
        </button>
      </div>
    )
  );
};

GalleryModal.propTypes = {
  galleryOpen: PropTypes.bool.isRequired,
  galleryImages: PropTypes.array.isRequired,
  activeImageIndex: PropTypes.number.isRequired,
  closeGallery: PropTypes.func.isRequired,
  prevImage: PropTypes.func.isRequired,
  nextImage: PropTypes.func.isRequired,
};

export default GalleryModal;
