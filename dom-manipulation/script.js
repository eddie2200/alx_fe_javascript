// ================================================
// Dynamic Quote Generator with Server Sync (Final)
// ================================================

// Default local quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

const notification = document.getElementById("notification");
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API

// =============================
// Local Storage Utilities
// =============================

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);
}

// =============================
// Category Filter Functions
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
// Add New Quote & Post to Server
// =============================

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !cat) return alert("Please enter both fields.");

  const newQuote = { text, category: cat };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Post to mock server
  postQuoteToServer(newQuote);
  alert("New quote added and synced!");
}

// =============================
// Step 1: Fetch from Server (mock)
// =============================

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server",
    }));
    resolveConflicts(serverQuotes);
  } catch (err) {
    console.error("Error fetching server data:", err);
  }
}

// =============================
// Step 2: Post to Server (mock)
// =============================

async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    console.log("Quote posted to server:", quote.text);
  } catch (err) {
    console.error("Error posting quote:", err);
  }
}

// =============================
// Step 3: Sync & Conflict Resolution
// =============================

function syncQuotes() {
  // periodically called to refresh data
  fetchQuotesFromServer();
}

function resolveConflicts(serverQuotes) {
  let newFromServer = serverQuotes.filter(
    s => !quotes.some(q => q.text === s.text)
  );

  if (newFromServer.length > 0) {
    quotes.push(...newFromServer);
    saveQuotes();
    populateCategories();
    showNotification(`${newFromServer.length} new quote(s) synced from server.`);
  }
}

function showNotification(msg) {
  notification.style.display = "block";
  notification.textContent = msg;
  setTimeout(() => (notification.style.display = "none"), 4000);
}

// =============================
// JSON Import / Export (unchanged)
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

// Step 2: Periodic sync (every 20s)
setInterval(syncQuotes, 20000);

