import axios from "axios";

const BASE_URL = "https://en.wikipedia.org/w/api.php";

export const debugWikiResponse = async (title) => {
  console.log("Starting debugWikiResponse function...");

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

    console.log("Wikipedia API Response (data.parse):", response.data.parse);

    return {
      success: true,
      message: "Response logged to console. Check the output.",
    };
  } catch (error) {
    console.error("Error during API request:", error.message);
    return {
      success: false,
      message: "Failed to fetch Wikipedia data. Check console for details.",
    };
  }
};

// Call the function
(async () => {
  const title = "Plant"; // Replace with a valid Wikipedia page title
  const result = await debugWikiResponse(title);
  console.log("Function result:", result);
})();
