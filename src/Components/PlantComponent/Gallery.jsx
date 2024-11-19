import PropTypes from "prop-types";

const Gallery = ({ galleryImages, title, openGallery }) => {
  return (
    galleryImages.length > 0 && (
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
    )
  );
};

Gallery.propTypes = {
  galleryImages: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  openGallery: PropTypes.func.isRequired,
};

export default Gallery;
