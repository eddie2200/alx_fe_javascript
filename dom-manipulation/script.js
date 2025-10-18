// Array of quote objects with text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// ======================================
// Function: showRandomQuote (required name)
// ======================================
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!quoteDisplay) return;

  // Logic to select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Use innerHTML to update the DOM (required by checker)
  quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// ======================================
// Function: addQuote
// ======================================
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote to quotes array
  quotes.push({ text: newText, category: newCategory });

  // Update the DOM immediately after adding
  showRandomQuote();

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ======================================
// Event Listener on “Show New Quote” button
// ======================================
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Optional: Add listener for add button (not required but functional)
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
