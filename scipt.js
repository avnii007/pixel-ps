const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const statusDiv = document.getElementById("status");
const resultsContainer = document.getElementById("results");

async function searchImages(query) {
  if (!query.trim()) {
    statusDiv.textContent = "Please enter a search term.";
    return;
  }

  // 1. LOADING STATE: Show loading UI before starting fetch
  statusDiv.innerHTML = '<div class="spinner"></div> Searching...';
  resultsContainer.innerHTML = "";

  // Wikimedia Commons Search API URL
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    query
  )}&gsrlimit=12&prop=imageinfo&iiprop=url&format=json&origin=*`;

  try {
    const response = await fetch(url);

    // Check response status
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 2. EMPTY STATE: Handle cases where no items are returned
    if (!data.query || !data.query.pages) {
      statusDiv.textContent = `No results found for "${query}". Try another search.`;
      return;
    }

    const items = Object.values(data.query.pages);

    // 4. POLISH: Show total result count
    statusDiv.textContent = `Showing ${items.length} results for "${query}".`;

    // Render results
    renderResults(items);
  } catch (error) {
    // 3. ERROR STATE: Show friendly error message on network or parsing failure
    console.error("Fetch error:", error);
    statusDiv.textContent = "Something went wrong. Please check your connection and try again.";
  }
}

function renderResults(items) {
  resultsContainer.innerHTML = items
    .map((item) => { // Polish: Card rendering with smooth CSS transitions
      const title = item.title.replace("File:", "");
      const imageUrl = item.imageinfo ? item.imageinfo[0].url : "";

      if (!imageUrl) return "";

      return `
        <div class="card">
          <img src="${imageUrl}" alt="${title}" loading="lazy" />
          <p class="card-title">${title}</p>
        </div>
      `;
    })
    .join("");
}

// Event Listeners
searchBtn.addEventListener("click", () => searchImages(searchInput.value));
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchImages(searchInput.value);
});