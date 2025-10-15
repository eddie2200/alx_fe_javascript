// =============================
// Dynamic Quote Generator
// =============================

// Default quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// =============================
// Step 4: Web Storage Integration
// =============================

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}

// =============================
// Step 6: Category Filtering
// =============================

// Populate dropdown with unique categories
function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Show a random quote filtered by category
function showRandomQuoteByCategory(category) {
  const filteredQuotes =
    category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML =
      `<p>No quotes available for this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <p style="font-style: italic; color: gray;">— Category: ${quote.category}</p>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// =============================
// Step 2: Show Random Quote (Updated for filtering)
// =============================

function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value || "all";
  showRandomQuoteByCategory(selectedCategory);
}

// =============================
// Step 3: Add New Quote
// =============================

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuoteText = textInput.value.trim();
  const newQuoteCategory = categoryInput.value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please fill in both the quote and category fields.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  updateCategoryFilter();
  showRandomQuote();
  alert("New quote added successfully!");
}

// =============================
// Step 5: JSON Import & Export
// =============================

// Export quotes as JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format: expected an array of quotes.");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      updateCategoryFilter();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (err) {
      alert("Error importing file. Please check the JSON format.");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// =============================
// Initialization
// =============================

loadQuotes();
updateCategoryFilter();

const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <p style="font-style: italic; color: gray;">— Category: ${quote.category}</p>
  `;
} else {
  showRandomQuote();
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);
document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
document.getElementById("categoryFilter").addEventListener("change", showRandomQuote);

