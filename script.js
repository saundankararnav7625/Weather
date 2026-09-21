// Weather app using Open-Meteo (free, no API key needed).
// Step 1: turn a city name into coordinates (geocoding API).
// Step 2: ask the forecast API for the weather at those coordinates.

const form = document.querySelector("#search-form");
const cityInput = document.querySelector("#city");
const button = form.querySelector("button");
const message = document.querySelector("#message");
const result = document.querySelector("#result");

// Open-Meteo returns a numeric "weather code". This maps each code to
// a description and a "sky" name that style.css uses for the background.
const WEATHER_CODES = {
  0: ["Clear sky", "clear"],
  1: ["Mainly clear", "clear"],
  2: ["Partly cloudy", "cloudy"],
  3: ["Overcast", "cloudy"],
  45: ["Fog", "fog"],
  48: ["Freezing fog", "fog"],
  51: ["Light drizzle", "rain"],
  53: ["Drizzle", "rain"],
  55: ["Heavy drizzle", "rain"],
  56: ["Freezing drizzle", "rain"],
  57: ["Heavy freezing drizzle", "rain"],
  61: ["Light rain", "rain"],
  63: ["Rain", "rain"],
  65: ["Heavy rain", "rain"],
  66: ["Freezing rain", "rain"],
  67: ["Heavy freezing rain", "rain"],
  71: ["Light snow", "snow"],
  73: ["Snow", "snow"],
  75: ["Heavy snow", "snow"],
  77: ["Snow grains", "snow"],
  80: ["Light rain showers", "rain"],
  81: ["Rain showers", "rain"],
  82: ["Heavy rain showers", "rain"],
  85: ["Snow showers", "snow"],
  86: ["Heavy snow showers", "snow"],
  95: ["Thunderstorm", "storm"],
  96: ["Thunderstorm with hail", "storm"],
  99: ["Severe thunderstorm with hail", "storm"],
};

async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("The city search is unavailable. Try again in a moment.");

  const data = await response.json();
  if (!data.results) throw new Error(`No city found for "${city}". Check the spelling.`);
  return data.results[0];
}

async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min",
    timezone: "auto",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("The weather service is unavailable. Try again in a moment.");
  return response.json();
}

function showWeather(place, weather) {
  const now = weather.current;
  const units = weather.current_units;
  const [description, sky] = WEATHER_CODES[now.weather_code] || ["Unknown conditions", "default"];

  document.body.dataset.sky = sky;
  document.querySelector("#place").textContent = `${place.name}, ${place.country}`;
  document.querySelector("#condition").textContent = description;
  document.querySelector("#temp").textContent = `${Math.round(now.temperature_2m)}${units.temperature_2m}`;
  document.querySelector("#feels").textContent = `${Math.round(now.apparent_temperature)}${units.apparent_temperature}`;
  document.querySelector("#range").textContent =
    `${Math.round(weather.daily.temperature_2m_max[0])}° / ${Math.round(weather.daily.temperature_2m_min[0])}°`;
  document.querySelector("#humidity").textContent = `${now.relative_humidity_2m}${units.relative_humidity_2m}`;
  document.querySelector("#wind").textContent = `${Math.round(now.wind_speed_10m)} ${units.wind_speed_10m}`;

  result.hidden = false;
  message.textContent = "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the page from reloading
  const city = cityInput.value.trim();
  if (!city) return;

  button.disabled = true;
  message.textContent = "Loading...";

  try {
    const place = await getCoordinates(city);
    const weather = await getWeather(place.latitude, place.longitude);
    showWeather(place, weather);
  } catch (error) {
    result.hidden = true;
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
