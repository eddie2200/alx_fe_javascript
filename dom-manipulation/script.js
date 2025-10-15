// ======================================================
// Dynamic Quote Generator with Web Storage + Server Sync
// ======================================================

// Default quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

const notification = document.getElementById("notification");

// =============================
// Local Storage Helpers
// =============================

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);
}

// =============================
// Populate Categories & Filter
// =============================

function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  dropdown.innerHTML = "";

  const categories = [...new Set(quotes.map(q => q.category))].sort();
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  dropdown.appendChild(allOption);

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    dropdown.appendChild(opt);
  });

  const savedCat = localStorage.getItem("selectedCategory");
  dropdown.value = savedCat && [...dropdown.options].some(o => o.value === savedCat)
    ? savedCat
    : "all";
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filtered =
    selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${random.text}"</p>
    <p style="font-style: italic; color: gray;">— Category: ${random.category}</p>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// =============================
// Add New Quote
// =============================

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !cat) return alert("Please enter both quote and category.");

  const newQuote = { text, category: cat };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("New quote added!");

  // Simulate sending to server
  syncQuoteToServer(newQuote);
}

// =============================
// JSON Import / Export
// =============================

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON format.");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error importing JSON file.");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// =============================
// Step 1–2: Server Sync Simulation
// =============================

// We'll simulate a remote server using JSONPlaceholder posts
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch server quotes periodically (simulation)
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Convert placeholder data into quote objects
    const serverQuotes = data.slice(0, 5).map(d => ({
      text: d.title,
      category: "Server",
    }));

    resolveConflicts(serverQuotes);
  } catch (err) {
    console.error("Error fetching server quotes:", err);
  }
}

// Push new quote to the server (simulated)
async function syncQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    console.log("Quote synced to server:", quote.text);
  } catch (err) {
    console.error("Error syncing quote:", err);
  }
}

// =============================
// Step 3: Conflict Resolution
// =============================

function resolveConflicts(serverQuotes) {
  // Identify any quotes that aren't in local storage yet
  let newOnServer = serverQuotes.filter(
    s => !quotes.some(q => q.text === s.text)
  );

  if (newOnServer.length > 0) {
    quotes.push(...newOnServer);
    saveQuotes();
    populateCategories();
    showNotification(`${newOnServer.length} new quote(s) synced from server.`);
  }
}

function showNotification(message) {
  notification.style.display = "block";
  notification.textContent = message;
  setTimeout(() => (notification.style.display = "none"), 4000);
}

// =============================
// Initialization
// =============================

loadQuotes();
populateCategories();
filterQuotes();

document.getElementById("newQuote").addEventListener("click", filterQuotes);
document.getElementById("addQuote").addEventListener("click", addQuote);
document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// Periodic sync with "server"
setInterval(fetchServerQuotes, 20000); // every 20 s

