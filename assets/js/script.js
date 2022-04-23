const apiKey = "21adefc09b5ec5d7001ecfa091eb1fff"; 
let searchCity = $("#search-city");
let searchHistory = $("#search-history");
let searchBtn = $("#btn");

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
          let lat = data[0]["lat"];
          let lon = data[0]["lon"];
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

searchBtn.on("click", getCity);