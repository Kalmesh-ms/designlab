import PropTypes from "prop-types";

const Thumbnail = ({ thumbnail, title }) => {
  return (
    thumbnail && (
      <div className="thumbnail-container">
        <img
          src={`https://en.wikipedia.org/wiki/Special:FilePath/${thumbnail}`}
          alt={`${title} thumbnail`}
          className="thumbnail-image"
        />
      </div>
    )
  );
};

Thumbnail.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Thumbnail;
