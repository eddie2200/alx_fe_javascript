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
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update the DOM using innerHTML
  quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// ===============================
// Function: createAddQuoteForm
// ===============================
function createAddQuoteForm() {
  // Create container
  const formDiv = document.createElement("div");

  // Create input fields
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  // Create add button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";

  // Add click handler to add new quote
  addBtn.addEventListener("click", function addQuote() {
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text === "" || category === "") {
      alert("Please enter both a quote and a category.");
      return;
    }

    // Add new quote to the quotes array
    quotes.push({ text: text, category: category });

    // Update the DOM immediately to show the new quote
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${text}" - ${category}`;

    // Clear inputs
    textInput.value = "";
    categoryInput.value = "";
  });

  // Append elements to form container
  formDiv.appendChild(textInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addBtn);

  // Append form to the body
  document.body.appendChild(formDiv);
}

// ===============================
// Event Listener for “Show New Quote”
// ===============================
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ===============================
// Initialize
// ===============================
createAddQuoteForm();