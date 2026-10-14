async function getWeather() {
    const cityInput = document.getElementById("city");
    const result = document.getElementById("result");
    const city = cityInput.value.trim();

    if (!city) {
        result.textContent = "Please enter a city name.";
        return;
    }

    result.textContent = "Loading weather...";

    try {
        // Find the city's coordinates
        const locationUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const locationResponse = await fetch(locationUrl);

        if (!locationResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            result.textContent = "City not found. Please try another name.";
            return;
        }

        const location = locationData.results[0];

        // Get the current weather
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

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
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Slight snow",
            73: "Moderate snow",
            75: "Heavy snow",
            80: "Rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            95: "Thunderstorm"
        };

        const condition =
            weatherConditions[current.weather_code] || "Weather condition unavailable";

        // Display the result safely
        result.replaceChildren();

        const title = document.createElement("h2");
        title.textContent = `${location.name}, ${location.country}`;

        const details = [
            `Temperature: ${current.temperature_2m} °C`,
            `Feels like: ${current.apparent_temperature} °C`,
            `Condition: ${condition}`,
            `Humidity: ${current.relative_humidity_2m}%`,
            `Wind speed: ${current.wind_speed_10m} km/h`
        ];

        result.appendChild(title);

        details.forEach((detail) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = detail;
            result.appendChild(paragraph);
        });
    } catch (error) {
        result.textContent =
            "Unable to fetch weather. Please check your connection and try again.";
        console.error(error);
    }
}
