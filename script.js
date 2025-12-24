const apiKey = "53cedde1b931036ffc002d9e46dfcef9";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const resultsEl = document.getElementById("results");
const favListEl = document.getElementById("favList");

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
renderFavorites();

// Search handler
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

// Fetch weather from API
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      resultsEl.innerHTML = `<p>City not found.</p>`;
      return;
    }

    displayWeather(data);
    
  } catch (error) {
    console.error(error);
    resultsEl.innerHTML = `<p>Error retrieving data.</p>`;
  }
}

// Display weather result
function displayWeather(data) {
  const { name, main, weather } = data;
  resultsEl.innerHTML = `
    <div>
      <h2>${name}</h2>
      <p>${weather[0].description}</p>
      <p>Temp: ${main.temp}°C</p>
      <button onclick="saveFavorite('${name}')">⭐ Save as Favorite</button>
    </div>
  `;
}

// Save as favorite
function saveFavorite(city) {
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}

// Render favorites list
function renderFavorites() {
  favListEl.innerHTML = "";
  favorites.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => fetchWeather(city));
    favListEl.appendChild(li);
  });
}
