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
    // Fetch the entire page's content in one call
    const response = await axios.get(BASE_URL, {
      params: {
        action: "parse",
        format: "json",
        origin: "*",
        page: title,
        prop: "text|sections",
      },
    });

    if (!response.data.parse) {
      console.warn(`No data found for "${title}"`);
      return null;
    }

    const sections = response.data.parse.sections.filter(
      (section) => !excludedSections.includes(section.line)
    );

    if (sections.length === 0) {
      console.warn(`No valid sections found for "${title}"`);
      return null;
    }

    const pageHtml = response.data.parse.text["*"]; // Full page HTML
    const sectionTextData = extractSectionsText(pageHtml, sections);
    return sectionTextData;
  } catch (error) {
    console.error(`Error fetching text data for "${title}":`, error);
    return null;
  }
};

// Function to process the full HTML and extract relevant section text
const extractSectionsText = (pageHtml, sections) => {
  const sectionTextData = {};

  sections.forEach((section) => {
    try {
      const sectionTitle = section.line;
      const cleanTitle = sectionTitle.replace(/\s+/g, "_").toLowerCase();

      // Create a regex to extract the section's content
      const sectionStartRegex = new RegExp(
        `<h\\d[^>]*>${sectionTitle.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}.*?<\\/h\\d>`,
        "i"
      );

      const sectionStartMatch = pageHtml.match(sectionStartRegex);

      if (sectionStartMatch) {
        const sectionStartIndex = sectionStartMatch.index;
        const nextSectionStartIndex = findNextSectionIndex(
          pageHtml,
          sectionStartIndex,
          sectionTitle
        );

        const sectionHtml = pageHtml.substring(
          sectionStartIndex,
          nextSectionStartIndex
        );

        const cleanText = convertHtmlToText(sectionHtml);
        sectionTextData[cleanTitle] = cleanText;
      }
    } catch (error) {
      console.error(`Error processing section "${section.line}":`, error);
    }
  });

  return sectionTextData;
};

// Helper to find the next section's start index
const findNextSectionIndex = (html, currentIndex) => {
  const sectionRegex = /<h(\d)[^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = sectionRegex.exec(html))) {
    const sectionIndex = match.index;

    if (sectionIndex > currentIndex) {
      return sectionIndex;
    }
  }

  return html.length; // Default to the end of the HTML
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
