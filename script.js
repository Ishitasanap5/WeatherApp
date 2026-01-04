const apiKey = "beaffe8542a24d33b282a5936c34f585";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const weatherIcon = document.querySelector(".weather-icon");


function updateUI(data) {
    
    document.querySelector(".city").innerHTML = `${data.name}, ${data.sys.country}`;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    const condition = data.weather[0].main;
    const icons = {
        "Clear": "fa-sun",
        "Clouds": "fa-cloud",
        "Rain": "fa-cloud-showers-heavy",
        "Thunderstorm": "fa-bolt",
        "Snow": "fa-snowflake",
        "Mist": "fa-smog",
        "Haze": "fa-sun-haze" 
    };
    weatherIcon.className = `fa-solid ${icons[condition] || "fa-cloud"} weather-icon`;
}

async function checkWeather(city) {
    const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
    if (response.ok) {
        const data = await response.json();
        updateUI(data);
    } else {
        alert("City not found. Please try again.");
    }
}


async function getWeatherByCoords(lat, lon) {

    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    try {
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        
        if(geoData.length > 0) {
            checkWeather(geoData[0].name);
        }
    } catch (error) {
        console.error("Location error", error);
    }
}

locationBtn.addEventListener("click", () => {
    document.querySelector(".city").innerHTML = "Locating...";

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
            alert("Location access denied. Please type 'Nashik' manually.");
            document.querySelector(".city").innerHTML = "Search a City";
        },
        { 
            enableHighAccuracy: true, 
            timeout: 5000, 
            maximumAge: 0 
        }
    );
});

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));