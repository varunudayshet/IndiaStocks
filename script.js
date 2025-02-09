// -------------------------
// EVENT LISTENERS & INIT
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Attach click listeners to any existing stock cards
  const stockCards = document.querySelectorAll(".stock-card");
  stockCards.forEach((card) => {
    card.addEventListener("click", handleStockSelection);
  });

  // Search button event listener
  const searchButton = document.querySelector(".search-button");
  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);
  } else {
    console.error("Search button (.search-button) not found.");
  }

  // SIP button event listener
  const sipButton = document.getElementById("startSIPButton");
  if (sipButton) {
    sipButton.addEventListener("click", (e) => {
      e.preventDefault();
      startSIP();
    });
  } else {
    console.error("SIP button (#startSIPButton) not found.");
  }

  // Show default stock graph (example: AAPL or RELIANCE.BO)
  const defaultSymbol = "AAPL"; // You can set this to your preferred default symbol
  displayStockGraph(defaultSymbol);
});

// -------------------------
// API CONFIGURATION
// -------------------------
// Financial Modeling Prep API Key (using "demo" for testing; replace with your key if needed)
const API_KEY = "mzfkcYqcUtfszqLfnLFBWgf9XtTHtRzL";

/**
 * Fetch historical stock data from Financial Modeling Prep.
 * Endpoint URL:
 *   https://financialmodelingprep.com/api/v3/historical-price-full/{symbol}?serietype=line&apikey=YOUR_API_KEY
 *
 * @param {string} symbol - The stock symbol (e.g., "AAPL" or "RELIANCE.BO")
 * @returns {Promise<Array<{ date: string, close: number }>>} Array of data points, or null if error
 */
async function fetchStockData(symbol) {
  if (!symbol) {
    alert("Stock symbol is missing.");
    return null;
  }

  const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("HTTP error status:", response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched data for", symbol, ":", data);

    if (!data.historical || data.historical.length === 0) {
      alert("No historical data available for this stock.");
      return null;
    }

    // The API returns data in descending order (latest first); reverse to have oldest data first.
    const historicalData = data.historical.reverse();

    // Map the data to an array of objects with date and close price.
    return historicalData.map((item) => ({
      date: item.date,
      close: item.close,
    }));
  } catch (error) {
    console.error("Error in fetchStockData:", error);
    alert("Failed to fetch stock data. Please try again later.");
    return null;
  }
}

// -------------------------
// CHART & DISPLAY FUNCTIONS
// -------------------------
/**
 * Display the stock chart using Chart.js.
 *
 * @param {string} symbol - The stock symbol to display.
 */
async function displayStockGraph(symbol) {
  const stockData = await fetchStockData(symbol);
  if (!stockData) return;

  // Extract labels (dates) and data points (closing prices)
  const labels = stockData.map((data) => data.date);
  const dataPoints = stockData.map((data) => data.close);

  // Prepare the dataset for Chart.js
  const dataset = {
    label: symbol,
    data: dataPoints,
    borderColor: getRandomColor(),
    fill: false,
    tension: 0.1,
  };

  const canvas = document.getElementById("stockChart");
  if (!canvas) {
    console.error("Canvas element with id 'stockChart' not found.");
    return;
  }

  const ctx = canvas.getContext("2d");

  // Destroy any existing chart instance to avoid duplicates
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  // Create a new line chart
  window.chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [dataset],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Date" },
        },
        y: {
          title: { display: true, text: "Price (₹)" },
          beginAtZero: false,
        },
      },
    },
  });
}

/**
 * Returns a random HSL color string.
 *
 * @returns {string} Random HSL color.
 */
function getRandomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
}

// -------------------------
// EVENT HANDLERS
// -------------------------
/**
 * Handle click event on a stock card.
 *
 * @param {Event} event - The click event.
 */
function handleStockSelection(event) {
  const symbolElement = event.currentTarget.querySelector(".stock-symbol");
  if (!symbolElement) {
    alert("Stock symbol element not found in card.");
    return;
  }
  const symbol = symbolElement.textContent.trim();
  if (!symbol) {
    alert("Stock symbol is empty.");
    return;
  }
  console.log("Stock card clicked for symbol:", symbol);
  displayStockGraph(symbol);
}

/**
 * Handle the search functionality.
 */
async function handleSearch() {
  const searchInput = document.querySelector(".search-input");
  if (!searchInput) {
    alert("Search input field not found.");
    return;
  }

  const symbol = searchInput.value.trim().toUpperCase();
  if (!symbol) {
    alert("Please enter a stock symbol.");
    return;
  }
  console.log("Searching for symbol:", symbol);

  const stockData = await fetchStockData(symbol);
  if (stockData) {
    displaySearchResults(stockData, symbol);
  }
}

/**
 * Display search results by updating the stock grid and showing the graph.
 *
 * @param {Array} data - The fetched stock data.
 * @param {string} symbol - The stock symbol.
 */
function displaySearchResults(data, symbol) {
  if (!data || data.length === 0) {
    alert("No stock data to display.");
    return;
  }

  const latestData = data[data.length - 1];
  const stockContainer = document.querySelector(".stock-grid");
  if (!stockContainer) {
    console.error("Stock grid container (.stock-grid) not found.");
    return;
  }

  // Update the grid with one stock card (you can expand this to multiple cards as needed)
  stockContainer.innerHTML = `
    <div class="stock-card">
      <div class="stock-header">
        <span class="stock-symbol">${symbol}</span>
        <span class="stock-price">₹${latestData.close.toFixed(2)}</span>
      </div>
    </div>
  `;

  // Attach click event on the new card
  const newCard = stockContainer.querySelector(".stock-card");
  if (newCard) {
    newCard.addEventListener("click", handleStockSelection);
  }

  // Display the chart for the searched symbol
  displayStockGraph(symbol);
}

/**
 * Start the SIP (Systematic Investment Plan) simulation.
 */
function startSIP() {
  const symbolSelect = document.querySelector(".sip-form select");
  const amountInput = document.querySelector('.sip-form input[type="number"]');

  if (!symbolSelect) {
    alert("SIP fund selection not found.");
    return;
  }
  if (!amountInput) {
    alert("SIP amount input not found.");
    return;
  }

  const symbol = symbolSelect.value;
  const amount = parseFloat(amountInput.value);

  if (!symbol) {
    alert("Please select a fund.");
    return;
  }
  if (!amount || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid SIP amount.");
    return;
  }

  alert(`SIP started for ${symbol} with ₹${amount}/month`);
  calculateXIRR(symbol, amount);
}

/**
 * Calculate the XIRR (Internal Rate of Return) for the SIP investments.
 * (This function uses a placeholder value.)
 *
 * @param {string} symbol - The fund or stock symbol.
 * @param {number} amount - The monthly investment amount.
 */
function calculateXIRR(symbol, amount) {
  const startDate = new Date();
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  );

  const investmentData = [
    { date: startDate, amount: -amount },
    { date: endDate, amount: amount },
  ];

  const xirrValue = XIRR(investmentData);

  const xirrElement = document.getElementById("xirr-value");
  if (!xirrElement) {
    console.error("XIRR display element (#xirr-value) not found.");
    return;
  }
  xirrElement.textContent = `${xirrValue.toFixed(2)}%`;
}

/**
 * Placeholder function for XIRR calculation.
 *
 * @param {Array} data - Array of investment data.
 * @returns {number} Dummy XIRR value.
 */
function XIRR(data) {
  // Replace this with an actual XIRR calculation if needed.
  return 12.5;
}
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const apiKey = "e2418dc8090448878e2318c91329b4e9";

const expenseList = document.getElementById("expense-list");
const totalAmountElement = document.getElementById("total-amount");
const addExpenseButton = document.getElementById("add-expense");

async function getExchangeRates() {
  try {
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`
    );
    const data = await response.json();
    console.log("Exchange rates:", data.rates);
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
}

async function addExpense() {
  console.log("addExpense function called");

  const name = document.getElementById("expense-name").value.trim();
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const currency = document.getElementById("currency").value;
  const category = document.getElementById("category").value;

  if (!name || isNaN(amount)) {
    alert("Please enter a valid expense name and amount!");
    return;
  }

  const rates = await getExchangeRates();
  if (!rates) {
    alert("Error fetching exchange rates. Try again later.");
    return;
  }

  const convertedAmount = amount / rates[currency];

  const expense = { name, amount, currency, category, convertedAmount };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  console.log("Updated expenses:", expenses);
  renderExpenses();

  document.getElementById("expense-name").value = "";
  document.getElementById("expense-amount").value = "";
}

function renderExpenses() {
  expenseList.innerHTML = "";

  expenses.forEach((expense, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <strong>${expense.name}</strong> - ${expense.amount} ${
      expense.currency
    } (${expense.category})
            (~${expense.convertedAmount.toFixed(2)} USD)
            <button onclick="deleteExpense(${index})">❌</button>
        `;
    expenseList.appendChild(li);
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

async function calculateTotal() {
  const rates = await getExchangeRates();
  if (!rates || !rates["INR"]) {
    alert("Error fetching exchange rates. Try again later.");
    return;
  }

  let totalUSD = expenses.reduce(
    (sum, expense) => sum + expense.convertedAmount,
    0
  );

  let totalINR = totalUSD * rates["INR"];
  totalAmountElement.textContent = `Total: ₹${totalINR.toFixed(2)} INR`;
}

async function convertCurrency() {
  const amount = parseFloat(document.getElementById("convert-amount").value);
  const fromCurrency = document.getElementById("from-currency").value;
  const toCurrency = document.getElementById("to-currency").value;
  const resultElement = document.getElementById("conversion-result");

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const rates = await getExchangeRates();
  if (!rates) {
    alert("Error fetching exchange rates. Try again later.");
    return;
  }

  const convertedAmount = (amount / rates[fromCurrency]) * rates[toCurrency];
  resultElement.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(
    2
  )} ${toCurrency}`;
}

addExpenseButton.addEventListener("click", addExpense);
totalButton.addEventListener("click", calculateTotal);

renderExpenses();
