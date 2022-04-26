const apiKey = "21adefc09b5ec5d7001ecfa091eb1fff"; 

// Search Items
let searchCity = $("#search-city");
let searchHistory = $("#search-history");
let searchBtn = $("#btn");

// Weather information item
let weatherInfo = $(".weather-info")
let currentDayInfo = $(".current-day-info");
let forecastInfo = $(".forecast-info");

// list of city searches
let searchCities = [];

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
          addSearchHistoryItem(data[0].name);
          
          // Saving search history to local Storage
          searchCities.push(data[0].name);
          localStorage.setItem('cities',JSON.stringify(searchCities));

          currentDayInfo.eq(0).find("h2").text(data[0].name + " (" + moment().format("l") + ")");
          let lat = data[0]["lat"];
          let lon = data[0]["lon"];

          // Using latitude and longitude coordinates to get weather info
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
let addSearchHistoryItem = function(cityName) {
  searchHistory.removeClass("display-off");
  // Make search history item
  let searchHistoryItem = document.createElement("div");
  searchHistoryItem.textContent = cityName;
  
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

        // Weather Icon 
        let currentWeatherIcon = document.createElement("img");
        currentWeatherIcon.setAttribute("alt","Weather Icon");
        let iconcode = data.current.weather[0].icon;
        let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        currentWeatherIcon.setAttribute('src', iconurl);
        currentDayInfo.eq(0).find("h2").append(currentWeatherIcon);

        // Temperature, Wind Speed, Humidity
        currentDayInfo.eq(0).find(".temp").text("Temp: " + data.current.temp + "°F");
        currentDayInfo.eq(0).find(".wind").text("Wind: " + data.current.wind_speed + "MPH");
        currentDayInfo.eq(0).find(".humidity").text("Humidity: " + data.current.humidity + "%");

        // Setting UV index
        let uvIndex = data.current.uvi;
        $(".UV-index").text(data.current.uvi);
        $(".UV-index").removeClass("favorable");
        $(".UV-index").removeClass("moderate");
        $(".UV-index").removeClass("severe");

        // change background color to correspond witb uv index
        if(uvIndex < 3) {
          $(".UV-index").addClass("favorable");
        }
        else if (uvIndex < 8) {
          $(".UV-index").addClass("moderate");
        }
        else {
          $(".UV-index").addClass("severe");
        }


        // Putting in 5 day forecast info
        for(let i = 0; i < forecastInfo.length; i++) {
          // Setting Date
          forecastInfo.eq(i).find("h4").text(moment().add(i+1, 'days').format("l"));

          // Weather Icon
          let iconcode = data.daily[i+1].weather[0].icon;
          let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          forecastInfo.eq(i).find(".forecast-icon").attr('src', iconurl);

          // Temperature, Wind, Humidity
          forecastInfo.eq(i).find(".forecast-temp").text("Temp: " + data.daily[i+1].temp.max + "°F");
          forecastInfo.eq(i).find(".forecast-wind").text("Wind: " + data.daily[i+1].wind_speed + "MPH");
          forecastInfo.eq(i).find(".forecast-humidity").text("Humidity: " + data.daily[i+1].humidity + "%");
        }
        weatherInfo.removeClass("display-off");
      })
    }
  })
}

searchBtn.on("click", getCity);

// Event Listener for search history items
searchHistory.on("click",".search-history-item", function(){
  currentDayInfo.eq(0).find("h2").text($(this).text() + " (" + moment().format("l") + ")");

  // get latitude and longitude coodinates and use them to call getWeatherInfo
  let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + $(this).text() + "&limit=1&appid=" + apiKey;
  fetch(apiUrl).then(function (response) {
    if(response.ok) {
      response.json().then(function (data) {
        // match found
        if(data.length === 1) {
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
})

window.onload = function() {
  // Check if there are previous search cities
  searchCities = JSON.parse(localStorage.getItem('cities'));
  // If there are cities, add them to search history
  if(searchCities && searchCities.length > 0) {
    for(let i = 0; i < searchCities.length; i++) {
      addSearchHistoryItem(searchCities[i]);
    }
  }
  else {
    searchCities = [];
  }
}