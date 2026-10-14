
const cityInput = document.getElementById("city");
const result = document.getElementById("result");

const weatherConditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

// Search when the user presses Enter
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        result.textContent = "Please enter a city name.";
        return;
    }

    result.textContent = "Loading weather...";

    try {
        // Find the city
        const locationUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const locationResponse = await fetch(locationUrl);

        if (!locationResponse.ok) {
            throw new Error("City search failed.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            result.textContent =
                "City not found. Please try another name.";
            return;
        }

        const location = locationData.results[0];

        // Get current weather using the city's coordinates
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Weather request failed.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        if (!current) {
            throw new Error("Weather data is unavailable.");
        }

        const condition =
            weatherConditions[current.weather_code] ||
            "Weather condition unavailable";

        // Display data safely
        result.replaceChildren();

        const title = document.createElement("h2");
        title.textContent =
            `${location.name}, ${location.country}`;
        result.appendChild(title);

        const details = [
            `Temperature: ${current.temperature_2m} °C`,
            `Feels like: ${current.apparent_temperature} °C`,
            `Condition: ${condition}`,
            `Humidity: ${current.relative_humidity_2m}%`,
            `Wind speed: ${current.wind_speed_10m} km/h`
        ];

        details.forEach(function (detail) {
            const paragraph = document.createElement("p");
            paragraph.textContent = detail;
            result.appendChild(paragraph);
        });
    } catch (error) {
        result.textContent =
            "Unable to fetch weather. Please check your connection and try again.";
        console.error("Weather App error:", error);
    }
}
