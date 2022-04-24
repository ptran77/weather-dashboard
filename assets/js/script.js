const apiKey = "21adefc09b5ec5d7001ecfa091eb1fff"; 
let searchCity = $("#search-city");
let searchHistory = $("#search-history");
let searchBtn = $("#btn");

let currentDayInfo = $(".current-day-info");
let forecastInfo = $(".forecast-info");

// function to get city from search bar
let getCity = function() {
  if(!searchCity.val()) {
    window.alert("No city was entered");
    return;
  }
  let cityName = searchCity.val();
  getLocationInfo(cityName);
}

// function to get location informaton
let getLocationInfo = function(cityName) {
  // make api call to get longitude and latitude position of the city
  let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
  fetch(apiUrl).then(function (response) {
    if(response.ok) {
      response.json().then(function (data) {
        // match found
        if(data.length === 1) {
          addSearchHistoryItem(data);
          currentDayInfo.eq(0).find("h2").text(data[0].name + " (" + moment().format("l") + ")");
          let lat = data[0]["lat"];
          let lon = data[0]["lon"];
          getWeatherInfo(lat,lon);
        }
        else{
          window.alert("Not a valid city or results not found");
        }
      })
    }
    else {
      window.alert("Not a valid city or results not found");
    }
  });
}

// function to add new search history item
let addSearchHistoryItem = function(data) {
  // Make search history item
  let searchHistoryItem = document.createElement("div");
  searchHistoryItem.textContent = data[0].name;
  
  // add classes to search history item
  searchHistoryItem.classList.add("search-history-item");
  searchHistoryItem.classList.add("w-100");
  searchHistoryItem.classList.add("text-center");
  searchHistoryItem.classList.add("mt-3");
  searchHistoryItem.classList.add("rounded");

  // add search history item to search history
  searchHistory.append(searchHistoryItem);
}

// function to get weather information
let getWeatherInfo = function(lat,lon) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&exclude=minutely,hourly,alerts" + "&appid=" + apiKey;
  fetch(apiUrl).then(function (response) {
    if(response.ok) {
      response.json().then(function (data) {
        console.log(data);
        // Putting in current day info
        currentDayInfo.eq(0).find(".temp").text("Temp: " + data.daily[0].temp.max + "°F");
        currentDayInfo.eq(0).find(".wind").text("Wind: " + data.daily[0].wind_speed + "MPH");
        currentDayInfo.eq(0).find(".humidity").text("Humidity: " + data.daily[0].humidity + "%");
        currentDayInfo.eq(0).find(".UV").find(".UV-index").text(data.daily[0].uvi);

        // Putting in 5 day forecast info
        for(let i = 0; i < forecastInfo.length; i++) {
          forecastInfo.eq(i).find("h4").text(moment().add(i+1, 'days').format("l"));
          forecastInfo.eq(i).find(".forecast-temp").text("Temp: " + data.daily[i+1].temp.max + "°F");
          forecastInfo.eq(i).find(".forecast-wind").text("Wind: " + data.daily[i+1].wind_speed + "MPH");
          forecastInfo.eq(i).find(".forecast-humidity").text("Humidity: " + data.daily[i+1].humidity + "%");
        }
      })
    }
  })
}

searchBtn.on("click", getCity);