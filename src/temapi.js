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

export const fetchPlantTextData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "parse",
        format: "json",
        origin: "*",
        page: title,
        prop: "sections|text",
      },
    });

    if (!response.data.parse || !response.data.parse.sections) {
      console.warn(`No sections found for "${title}"`);
      return null;
    }

    const sections = response.data.parse.sections.filter(
      (section) => !excludedSections.includes(section.line)
    );

    if (sections.length === 0) {
      console.warn(`No valid sections found for "${title}"`);
      return null;
    }

    const sectionTextData = await fetchSectionsText(title, sections);
    return sectionTextData;
  } catch (error) {
    console.error(`Error fetching text data for "${title}":`, error);
    return null;
  }
};

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
      sectionTextData[cleanTitle] = cleanText;
    } catch (error) {
      console.error(
        `Error fetching section ${section.index} for "${title}":`,
        error
      );
    }
  }

  return sectionTextData;
};

export const fetchPlantImageData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "query",
        format: "json",
        origin: "*",
        titles: title,
        prop: "images",
        imlimit: 50,
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
      .filter(
        (imageName) =>
          /\.(jpg|jpeg|png|gif)$/i.test(imageName) &&
          imageName.toLowerCase().includes(title.toLowerCase())
      );

    return validImages;
  } catch (error) {
    console.error(`Error fetching image data for "${title}":`, error);
    return [];
  }
};
