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

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = response.data.wind.speed;
  feelsElement.innerHTML = Math.round(response.data.main.feels_like);
  dateElement.innerHTML = formatDate(timestamp);
  timeElement.innerHTML = formatTime(timestamp);
}

let apiKey = "49de83b21739a14df5a0bd8a22f30861";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=${apiKey}&units=metric`;

console.log(apiUrl);
axios.get(apiUrl).then(displayTemperature);
