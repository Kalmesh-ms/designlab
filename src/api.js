// api.js
import axios from "axios";

// Base Wikipedia API URL
const BASE_URL = "https://en.wikipedia.org/w/api.php?origin=*";

// 1. Fetch data for the Portal:Plant category
export const fetchPlantPortal = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "query",
        format: "json",
        list: "categorymembers",
        cmtitle: "Category:Plants",
        cmlimit: 10,
      },
    });
    console.log("PORTAL DATA : ", response.data.query.categorymembers);
    console.log("----------------------------------------------------");
    return response.data.query.categorymembers;
  } catch (error) {
    console.error("Error fetching Plant Portal data:", error);
    return [];
  }
};

// 2. Fetch data for a specific plant (e.g., 'Rose')
export const fetchPlantData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "parse",
        format: "json",
        page: title,
        prop: "text|images|sections",
      },
    });
    console.log("ROSE DATA  : ", response.data.parse);
    console.log("----------------------------------------------------");

    return response.data.parse;
  } catch (error) {
    console.error(`Error fetching ${title} data:`, error);
    return null;
  }
};

// 3. Fetch Today's Featured Articles
export const fetchFeaturedArticle = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "query",
        format: "json",
        prop: "extracts",
        exintro: true,
        titles: "Wikipedia:Today's_featured_article",
      },
    });
    console.log("TODAY FART  : ", Object.values(response.data.query.pages)[0]);
    console.log("----------------------------------------------------");

    return Object.values(response.data.query.pages)[0];
  } catch (error) {
    console.error("Error fetching Featured Article:", error);
    return null;
  }
};

// 4. Fetch Good Articles in the Plant category
export const fetchGoodArticles = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "query",
        format: "json",
        list: "categorymembers",
        cmtitle: "Category:Good_articles",
        cmlimit: 10,
      },
    });
    console.log("GOOART  : ", response.data.query.categorymembers);
    console.log("----------------------------------------------------");

    return response.data.query.categorymembers;
  } catch (error) {
    console.error("Error fetching Good Articles:", error);
    return [];
  }
};

// 5. Fetch image URL by title
export const fetchImageUrl = async (imageTitle) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "query",
        format: "json",
        titles: `Image:${imageTitle}`,
        prop: "imageinfo",
        iiprop: "url",
      },
    });
    const page = Object.values(response.data.query.pages)[0];
    console.log("IMAGE URL  : ", page.imageinfo);
    console.log("----------------------------------------------------");

    return page.imageinfo ? page.imageinfo[0].url : null;
  } catch (error) {
    console.error(`Error fetching image URL for ${imageTitle}:`, error);
    return null;
  }
};
