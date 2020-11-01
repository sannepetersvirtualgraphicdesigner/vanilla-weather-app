// UTC (in sec), returns target timestamp (in ms),
function getTargetTimestamp(targetTimestampInSec, targetOffsetInSec) {
  let date = new Date();
  if (targetTimestampInSec !== null) {
    date = new Date(targetTimestampInSec * 1000);
  }
  // date.getTimezoneOffset() returns the time zone difference, in minutes, from current locale (host system settings) to UTC
  let localOffsetInMs = date.getTimezoneOffset() * 60 * 1000;
  let targetOffsetInMs = targetOffsetInSec * 1000;
  let targetTimestamp = date.getTime() + localOffsetInMs + targetOffsetInMs;
  return targetTimestamp;
}

// Display full date
function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let weekday = days[date.getDay()];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let fullDate = `${weekday}, ${day} ${month} ${year}`;
  return fullDate;
}

// Display single-digit numbers with leading zero
function leadingZero(value) {
  if (value < 10) {
    return (value = `0${value}`);
  } else {
    return value;
  }
}
// Display time
function formatTime(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let time = `${leadingZero(hours)}:${leadingZero(minutes)}`;
  return time;
}
function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let feelsElement = document.querySelector("#feels");
  let dateElement = document.querySelector("#date");
  let timeElement = document.querySelector("#time");
  let timestamp = getTargetTimestamp(null, response.data.timezone);
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = response.data.wind.speed;
  feelsElement.innerHTML = Math.round(response.data.main.feels_like);
  dateElement.innerHTML = formatDate(timestamp);
  timeElement.innerHTML = formatTime(timestamp);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-2">
      <img src="http://openweathermap.org/img/wn/${
        forecast.weather[0].icon
      }@2x.png" alt="" />
      <ul>
        <li>${formatTime(forecast.dt * 1000)}</li>
      </ul>
      <ul>
      <div class="weather-forecast-temperature">
        <li><strong>${Math.round(
          forecast.main.temp_max
        )} </strong>| ${Math.round(forecast.main.temp_min)}°</li>
      </div>
      </ul>
    </div>
  `;
  }
}

function search(city) {
  let apiKey = "49de83b21739a14df5a0bd8a22f30861";
  let apiBeginpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiBeginpoint}?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
  console.log(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

// Geolocation currentLocation
function retrievePosition(position) {
  let apiKey = "49de83b21739a14df5a0bd8a22f30861";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiBeginpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiBeginpoint}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayTemperature);
}
//Locate after current location button is clicked
function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

//Global variables
let currentlocationButton = document.querySelector("#current");
currentlocationButton.addEventListener("click", getPosition);

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Sydney");
