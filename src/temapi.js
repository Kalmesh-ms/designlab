// tempApi.js
import axios from "axios";
import { htmlToText } from "html-to-text";

const BASE_URL = "https://en.wikipedia.org/w/api.php";
const excludedSections = [
  "References",
  "External links",
  "See also",
  "Further reading",
  "Other sources",
];

// Helper function to convert HTML to plain text
const convertHtmlToText = (html) => {
  return htmlToText(html, {
    wordwrap: null,
    ignoreHref: true,
    selectors: [
      { selector: "style", format: "skip" },
      { selector: "script", format: "skip" },
      { selector: "a", format: "inline" },
      { selector: "sup", format: "skip" },
      { selector: "span.editsection", format: "skip" },
      { selector: "img", format: "skip" },
      { selector: "div.reflist", format: "skip" },
      { selector: "ol.references", format: "skip" },
      { selector: "li[id^='cite_note']", format: "skip" },
    ],
  })
    .replace(/\[edit\]/g, "")
    .trim();
};

// Function to fetch plant text data from Wikipedia API in a single request
export const fetchPlantTextData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "parse",
        format: "json",
        origin: "*",
        page: title,
        prop: "text",
      },
    });

    const parsedText = response.data.parse?.text["*"];
    if (!parsedText) return null;

    // Convert HTML to plain text and filter out unwanted sections
    const cleanText = convertHtmlToText(parsedText);
    const filteredText = cleanText
      .split("\n")
      .filter(
        (line) =>
          !excludedSections.some((excluded) => line.startsWith(excluded))
      )
      .join("\n");

    return filteredText;
  } catch (error) {
    console.error(`Error fetching text data for "${title}":`, error);
    return null;
  }
};

// Function to fetch plant image data from Wikipedia API with limited image results
export const fetchPlantImageData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "query",
        format: "json",
        origin: "*",
        titles: title,
        prop: "images",
        imlimit: 10, // Limit to 10 images for faster response
      },
    });

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId]?.images;

    if (!images) {
      console.warn(`No images found for "${title}"`);
      return [];
    }

    const validImages = images
      .map((image) => image.title)
      .filter((imageName) => /\.(jpg|jpeg|png)$/i.test(imageName));

    return validImages;
  } catch (error) {
    console.error(`Error fetching image data for "${title}":`, error);
    return [];
  }
};
