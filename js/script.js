// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
const today = new Date();
const weatherForm = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#cityInput");
const currentWeatherContainer = document.querySelector(
  ".current-weather-container"
);

const apiKey = "e88037c6eef87f8558752cc4f5fa3ca4";

async function getForcastWeatherData(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  );
  const forcastWeatherData = await response.json();
  console.log({ forcastWeatherData });
  createFutureWeatherCard(forcastWeatherData);
}

async function getCurrentWeatherData(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  );
  const currentWeatherData = await response.json();
  console.log({ currentWeatherData }); //this is the data store at local storage
  createCurrentWeatherCard(currentWeatherData);
}

async function getLatAndLonData(city) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
  );
  const latLonData = await response.json();
  console.log({ latLonData });
  const lat = latLonData[0].lat;
  const lon = latLonData[0].lon;
  getForcastWeatherData(lat, lon);
  getCurrentWeatherData(lat, lon);
}

weatherForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const cityInputValue = cityInput.value;
  getLatAndLonData(cityInputValue);
});

function createCurrentWeatherCard(data) {
  const formattedDate = `${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}/${today.getFullYear().toString().slice(-2)}`;
  console.log(formattedDate);

  const city = data.name;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const icon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

  const container = document.createElement("div");

  container.classList.add("custom-card");
 
  const cityEl = document.createElement("h4");
  cityEl.classList.add("city-name");

  const iconEl = document.createElement("img");
  const tempEl = document.createElement("div");
  const humidityEl = document.createElement("div");
  const windEl = document.createElement("div");
  
  cityEl.textContent = `${city} (${formattedDate})`;
  iconEl.src = icon;
  tempEl.textContent = `Temperature: ${temp}`;
  humidityEl.textContent = `Humidity: ${humidity}`;
  windEl.textContent = `Wind: ${wind}`;

  container.append(cityEl,iconEl,tempEl,humidityEl, windEl);
  currentWeatherContainer.innerHTML = "";
  currentWeatherContainer.append(container);
  currentWeatherContainer.classList.add("current-weather-container-style")
}

function createFutureWeatherCard(data) {
  if (data.list.length === 0) {
    return;
  }
  const futureWeatherContainer = document.querySelector(
    ".future-weather-container"
  );
  futureWeatherContainer.innerHTML = "";
  for (let i = 7; i < data.list.length; i+=8) {
    const date = data.list[i].dt_txt;
    const temp = data.list[i].main.temp;
    const humidity = data.list[i].main.humidity;
    const wind = data.list[i].wind.speed;
    const icon = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;

    const container = document.createElement("div");
    container.classList.add("weather-card");
    const iconEl = document.createElement("img");
    const dateEl = document.createElement("div");
    const tempEl = document.createElement("div");
    const humidityEl = document.createElement("div");
    const windEl = document.createElement("div");
 
    const newDate = new Date(date);
    const formattedDate = `${(newDate.getMonth() + 1).toString().padStart(2, "0")}/${newDate.getDate().toString().padStart(2, "0")}/${newDate.getFullYear().toString().slice(-2)}`;
    dateEl.textContent = `${formattedDate}`;
    iconEl.src = icon;
    tempEl.textContent = `Temp: ${temp}`;
    humidityEl.textContent = `Humidity: ${humidity}`;
    windEl.textContent = `Wind: ${wind}`;

    container.append(dateEl,iconEl,tempEl, humidityEl, windEl);
    futureWeatherContainer.append(container);
    const forcastHeaderEl = document.getElementById("forcastHeader")
    forcastHeaderEl.style.display = "block"
  }
}
