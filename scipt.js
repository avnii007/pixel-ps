// 1. Grab your HTML elements by their IDs
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results");

// Optional Enhancement: Element to display result count
const statusMessage = document.getElementById("status-message");

// 2. Listen for form submit event
searchForm.addEventListener("submit", async (event) => {
  // Prevent page reload on submit
  event.preventDefault();

  // Read and clean the user's input query
  const query = searchInput.value.trim();

  // Task 4: Ignore empty searches
  if (!query) return;

  // Task 3: Clear previous results before fetching new ones
  resultsContainer.innerHTML = "";
  if (statusMessage) statusMessage.textContent = "Searching...";

  try {
    // Task 2: Fetch data from the Wikimedia Commons API
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
      "&gsrsearch=" + encodeURIComponent(query) +
      "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

    const response = await fetch(url);

    // Check if the network request succeeded
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Extract pages array safely
    const pages = data.query?.pages ? Object.values(data.query.pages) : [];

    // Task 5 (Enhancement): Display result count
    if (statusMessage) {
      statusMessage.textContent = pages.length > 0 
        ? `Showing ${pages.length} results for "${query}"` 
        : `No results found for "${query}"`;
    }

    // Task 3: Render results into the DOM
    renderResults(pages);

  } catch (error) {
    console.error("Error fetching images:", error);
    if (statusMessage) {
      statusMessage.textContent = "Failed to load results. Please try again.";
    }
  }
});

// Function to build and append cards into the DOM
function renderResults(items) {
  items.forEach((item) => {
    // Check if image URL exists
    const imageUrl = item.imageinfo?.[0]?.thumburl;
    if (!imageUrl) return;

    // Build the card container
    const card = document.createElement("article");
    card.className = "card";

    // Create image element
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = item.title || "Search result image";

    // Create caption/title element
    const caption = document.createElement("p");
    caption.textContent = item.title.replace("File:", ""); // Clean title text

    // Task 5 (Enhancement): Make card open full image in a new tab when clicked
    const link = document.createElement("a");
    link.href = item.imageinfo[0].descriptionurl || imageUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // Assemble components
    card.appendChild(img);
    card.appendChild(caption);
    link.appendChild(card);
    
    // Append card link to grid container
    resultsContainer.appendChild(link);
  });
}