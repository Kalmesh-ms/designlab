import PropTypes from "prop-types";

const PlantDetails = ({
  plantSections,
  showAdditionalSections,
  toggleSections,
}) => {
  return (
    <div className="content">
      {plantSections["description"] && (
        <div className="section">
          <h2>Description</h2>
          <pre className="text-content">{plantSections["description"]}</pre>
        </div>
      )}

      <button className="expand-button large-button" onClick={toggleSections}>
        {showAdditionalSections ? "Hide Details" : "Show More Details"}
      </button>

      {showAdditionalSections && (
        <>
          {Object.entries(plantSections)
            .slice(1, 4)
            .map(([sectionTitle, sectionContent]) => (
              <div key={sectionTitle} className="section">
                <h2>{sectionTitle.replace(/_/g, " ")}</h2>
                <pre className="text-content">{sectionContent}</pre>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

PlantDetails.propTypes = {
  plantSections: PropTypes.object.isRequired,
  showAdditionalSections: PropTypes.bool.isRequired,
  toggleSections: PropTypes.func.isRequired,
};

export default PlantDetails;
