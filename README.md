# Weather App

A small web app that shows the current weather for any city. Type a city name and it shows the temperature, conditions, humidity, wind, and today's high and low. The background color changes with the weather.

Built with plain HTML, CSS, and JavaScript. Weather data comes from [Open-Meteo](https://open-meteo.com/), which is free and needs no API key.

## Run it

1. Download or clone this repo.
2. Open `index.html` in your browser.

## How it works

1. The city name goes to Open-Meteo's geocoding API, which returns its latitude and longitude.
2. Those coordinates go to the forecast API, which returns the current weather.
3. `script.js` puts the results on the page and sets the background from the weather code.

## Files

- `index.html`: page structure
- `style.css`: layout and the weather-based backgrounds
- `script.js`: API calls and page updates

## Ideas for next steps

- Add a °C / °F toggle (the API accepts `temperature_unit=fahrenheit`)
- Show a 5-day forecast using the `daily` data
- Remember the last searched city with `localStorage`
- Add a "Use my location" button with the browser's Geolocation API

## Live demo

https://github.com/saundankararnav7625/Weather.git
