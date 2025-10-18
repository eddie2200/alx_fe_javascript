// ===============================
// Quotes Array
// ===============================
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// ===============================
// Function: showRandomQuote
// ===============================
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update the DOM using innerHTML
  quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// ===============================
// Function: addQuote
// ===============================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote to quotes array
  quotes.push({ text: newText, category: newCategory });

  // Update the DOM immediately to reflect the change
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${newText}" - ${newCategory}`;

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";
}

// ===============================
// Event Listener on “Show New Quote” button
// ===============================
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
