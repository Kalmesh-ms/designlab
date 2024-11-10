import { useState, useEffect } from "react";
import {
  fetchPlantPortal,
  fetchPlantData,
  fetchFeaturedArticle,
  fetchGoodArticles,
  fetchImageUrl,
} from "./api";

const PlantDataComponent = () => {
  const [plantPortal, setPlantPortal] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [goodArticles, setGoodArticles] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("Mango"); // Default to 'Rose'
  const [plantData, setPlantData] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state

  // Fetch all the data on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      const portalData = await fetchPlantPortal();
      setPlantPortal(portalData);

      const featuredData = await fetchFeaturedArticle();
      setFeaturedArticle(featuredData);

      const goodArticleData = await fetchGoodArticles();
      setGoodArticles(goodArticleData);

      loadPlantData("Mangifera indica "); // Load default plant data
    };

    loadInitialData();
  }, []);

  // Fetch plant data when the selected plant changes
  const loadPlantData = async (plantTitle) => {
    setLoading(true); // Start loading
    setPlantData(null); // Clear old data
    setImageUrls([]); // Clear old images

    const data = await fetchPlantData(plantTitle);
    setPlantData(data);

    if (data && data.images) {
      const urls = await Promise.all(
        data.images.map((image) => fetchImageUrl(image))
      );
      setImageUrls(urls);
    }

    setLoading(false); // End loading
  };

  // Handle plant selection on click
  const handlePlantClick = (plantTitle) => {
    setSelectedPlant(plantTitle);
    loadPlantData(plantTitle);
  };

  return (
    <div>
      <h1>Plant Portal</h1>
      <ul>
        {plantPortal.map((plant) => (
          <li key={plant.pageid}>
            <a href="#" onClick={() => handlePlantClick(plant.title)}>
              {plant.title}
            </a>
          </li>
        ))}
      </ul>

      <h2>Featured Article</h2>
      {featuredArticle && <p>{featuredArticle.extract}</p>}

      <h2>Good Articles</h2>
      <ul>
        {goodArticles.map((article) => (
          <li key={article.pageid}>
            <a href="#" onClick={() => handlePlantClick(article.title)}>
              {article.title}
            </a>
          </li>
        ))}
      </ul>

      <h2>Plant Data: {selectedPlant}</h2>
      {loading && <p>Loading...</p>}
      {plantData && (
        <div>
          <h3>{plantData.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: plantData.text["*"] }} />
          <h3>Images</h3>
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Plant ${index}`}
                style={{ width: "200px" }}
              />
            ))
          ) : (
            <p>No images available for this plant.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantDataComponent;
