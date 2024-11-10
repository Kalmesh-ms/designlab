import axios from "axios";
import { htmlToText } from "html-to-text";

const BASE_URL = "https://en.wikipedia.org/w/api.php?origin=*";

// Exclude specific sections for a cleaner text output
const excludedSections = [
  "References",
  "Further reading",
  "External links",
  "Other sources",
];

export const fetchPlantTextData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "parse",
        format: "json",
        page: title,
        prop: "sections|text",
      },
    });

    const sections = response.data.parse.sections.filter(
      (section) => !excludedSections.includes(section.line)
    );

    const combinedText = await fetchSectionsText(title, sections);
    return combinedText;
  } catch (error) {
    console.error(`Error fetching text data for ${title}:`, error);
    return "Text data not available.";
  }
};

// Fetch images for gallery display with filtering
export const fetchPlantImageData = async (title) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        action: "query",
        format: "json",
        titles: title,
        prop: "images",
        imlimit: 50,
      },
    });

    const page = Object.values(response.data.query.pages)[0];
    const images = page.images
      .map((img) => img.title)
      .filter(
        (img) =>
          img.toLowerCase().includes(title.toLowerCase()) &&
          !img.toLowerCase().includes("wiki")
      );

    return images;
  } catch (error) {
    console.error(`Error fetching image data for ${title}:`, error);
    return [];
  }
};

// Helper to fetch and process each section's text
const fetchSectionsText = async (title, sections) => {
  let allText = "";

  for (const section of sections) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          action: "parse",
          format: "json",
          page: title,
          prop: "text",
          section: section.index,
        },
      });

      const sectionHtml = response.data.parse.text["*"];
      const cleanText = convertHtmlToText(sectionHtml);
      allText += `\n\n${cleanText}`;
    } catch (error) {
      console.error(
        `Error fetching section ${section.index} for ${title}:`,
        error
      );
    }
  }

  return allText;
};

// Convert HTML to plain text
const convertHtmlToText = (html) => {
  let text = htmlToText(html, {
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
  });

  return text.replace(/\[edit\]/g, "").trim();
};
