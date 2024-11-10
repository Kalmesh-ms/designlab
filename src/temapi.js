// temapi.js

import axios from "axios";
import { htmlToText } from "html-to-text";

const BASE_URL = "https://en.wikipedia.org/w/api.php";
const excludedSections = [
  "References",
  "External links",
  "See also",
  "Further reading",
  "Other sources",
]; // Exclude irrelevant sections

// Helper to convert HTML to plain text
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

// Fetch text data for each section and store by section title
export const fetchPlantTextData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "parse",
        format: "json",
        origin: "*", // Required for CORS support
        page: title,
        prop: "sections|text",
      },
    });

    // Check if 'parse' and 'sections' exist
    if (!response.data.parse || !response.data.parse.sections) {
      console.warn(`No sections found for "${title}"`);
      return null; // Indicate that the page is missing or has no sections
    }

    const sections = response.data.parse.sections.filter(
      (section) => !excludedSections.includes(section.line)
    );

    if (sections.length === 0) {
      console.warn(`No valid sections found for "${title}"`);
      return null; // No relevant sections
    }

    const sectionTextData = await fetchSectionsText(title, sections);

    return sectionTextData;
  } catch (error) {
    console.error(`Error fetching text data for "${title}":`, error);
    return null; // Indicate failure
  }
};

// Helper function to fetch text for each section and store it with the section title as key
const fetchSectionsText = async (title, sections) => {
  const sectionTextData = {};

  for (const section of sections) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          action: "parse",
          format: "json",
          origin: "*",
          page: title,
          prop: "text",
          section: section.index,
        },
      });

      const sectionHtml = response.data.parse.text["*"];
      const cleanText = convertHtmlToText(sectionHtml);
      const cleanTitle = section.line.replace(/\s+/g, "_").toLowerCase();
      sectionTextData[cleanTitle] = cleanText; // Store each section's text using section title as the key
    } catch (error) {
      console.error(
        `Error fetching section ${section.index} for "${title}":`,
        error
      );
    }
  }

  return sectionTextData;
};

// Fetch image data, including a thumbnail and gallery images if available
export const fetchPlantImageData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "query",
        format: "json",
        origin: "*",
        titles: title,
        prop: "images",
        imlimit: 50, // Increase the limit to fetch more images
      },
    });

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId]?.images;

    if (!images) {
      console.warn(`No images found for "${title}"`);
      return [];
    }

    // Filter to include only valid image types
    const validImages = images
      .map((image) => image.title)
      .filter((imageName) => /\.(jpg|jpeg|png|gif)$/i.test(imageName));

    return validImages;
  } catch (error) {
    console.error(`Error fetching image data for "${title}":`, error);
    return [];
  }
};
