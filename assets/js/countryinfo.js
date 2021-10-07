// no longer needed
// var SearchBoxEl = document.querySelector("#SearchBox-input")
var bodyEl = document.querySelector("body");
var countryInfo = document.querySelector("#countryInformation")
var countryData = JSON.parse(localStorage.getItem("countryData"));
var country = countryData.names.name;
var weatherData = [];
var openWeatherMapAPiKey = '1f9d3014d1a028a24c084adbdcec9008';
var upsplashUrl = "";
var alertEl = document.querySelector(".Alert");
var infoListEl = document.querySelector("#InfoList");
var upsplashAccessKey = "sUG4r-3ndwxJ_35XLlzNo7x-v70k-44ugUAux9bNqLQ";
// var displayCountryel = document.querySelector(".CountryName");
var progressBarEl = document.querySelector("#progressBar");
var NextDoor = document.querySelector("#NextDoor");
var YourSearchEl = document.querySelector(".YourSearch");

function init() {
    // Display progress bar
    progressBarEl.style.display = "block";
 
    // Get the country name out of the URL
    // Commenting the below codes out - due to fetch country data relocated back to script.js
    // let searchParamsArr = document.location.search.split("?");
    // console.log(searchParamsArr);
    // var country = searchParamsArr[1].split("=").pop();
    // country = country.toLowerCase();
    // console.log("country: " + country);

    upsplashGetDataUrl = "https://api.unsplash.com/search/photos/?client_id="
        + upsplashAccessKey
        + "&query="
        + country
        + "&order_by=relevant"
        + "&page=1"
        + "&per_page=10"
        + "&auto=format"
        // + "&color=colorOfChoice" - this parameter can be added later if certain color theme best match the website and fonts display
        ;

    upsplashGetPhotoUrl = "https://api.unsplash.com/photos/?client_id="
        + upsplashAccessKey
        + "&id=";

    fetchCountryPhoto(upsplashGetDataUrl);

    // fetchCountryData(country);

    fetchWeatherData(country);
};

// Need this similar fetch API data function here, for neighbour country button and history button to work properly
function btnFetchCountryData(event) {
    // Change the first and last character on fetch URL from ` to '
    // Was causing the country variable not recognised issue
    let btnCountry = event.target.textContent;
    console.log(btnCountry);
    fetch('https://travelbriefing.org/' + btnCountry + '?format=json')
      .then(response => {
          console.log(response);
          console.log(response.status); // 200
          console.log(response.statusText); // OK
          if (response.status != 200) {
              console.log("Response status is not 200!!")
          }
          return response.json();
      })
      .then(data => {
          if ( (btnCountry !== "netherlands") && (data.names.name === "Netherlands")) {
              console.log("Invalid search!")
          }
          else {
            localStorage.setItem("countryData", JSON.stringify(data));
            // this.reset();
            console.log("Search is valid!")
            console.log(data);
            location.assign("./countryinfo.html");
          }
      })
      .catch(err => {
          console.error(err);
      });
  };

// Fetch photo data from upsplash
function fetchCountryPhoto(dataUrl) {
    console.log("UpsplashUrl: " + dataUrl);
    fetch(dataUrl)
        .then(response => {
            console.log(response)
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log(data.results[0].id);
            let firstRelevantPhotoUrl = data.results[0].urls.full;
            console.log(firstRelevantPhotoUrl);
            // upsplashGetPhotoUrl += firstRelevantPhotoID;
            // console.log(upsplashGetPhotoUrl);

            bodyEl.style = "background-image: url(" + firstRelevantPhotoUrl + ")";
        })
        .catch(err => {
            console.error(err);
        });
};

// Fetch weather data
function fetchWeatherData(country) {
    let openWeatherMapUrl = "https://api.openweathermap.org/data/2.5/weather?q="
        + country
        + "&units=metric&appid="
        + openWeatherMapAPiKey;

    fetch(openWeatherMapUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            weatherData = data;
            countryInfoCard();
        })
        .catch(function (error) {
            console.log(error);
        });
};

function countryInfoCard() {

    // Country info good to know variables
    countryInfo.innerHTML = "";
    var heading = document.createElement("h1");
    var infoList = document.createElement("div");
    var unorderedList = document.createElement("ul");
    var countryName = document.createElement("li");
    var currency = document.createElement("li");
    var rate = document.createElement("li");
    var languageSpoken = document.createElement("li");
    var electricity = document.createElement("li");
    var volt = document.createElement("li");
    var frequency = document.createElement("li");
    var waterQuality = document.createElement("li");


    //shows go back button
    document.getElementById("goBack").style.display = "block";

    
    var tempEl = document.createElement("li");
    var feelsLikeEl = document.createElement("li");
    var humidityEl = document.createElement("li");
    var weatherIconLiEL = document.createElement("li");
    
    YourSearchEl.textContent = " All About " + countryData.names.name
    currency.textContent = "Currency: " + countryData.currency.code
    rate.textContent = "Rate: " + countryData.currency.rate
    languageSpoken.textContent = "Language: " + countryData.language[0].language
    // electricity.textContent = searchHistory.electricity
    volt.textContent = "Voltage: " + countryData.electricity.voltage
    frequency.textContent = "Frequency: " + countryData.electricity.frequency
    waterQuality.textContent = "Water Quality: " + countryData.water.short
    tempEl.textContent = "Today's temperature: " + weatherData.main.temp;
    feelsLikeEl.textContent = "Feels like: " + weatherData.main.feels_like;
    humidityEl.textContent = "Humidity: " + weatherData.main.humidity;


    heading.textContent = "Good to knows "
    currency.textContent = " Currency: " + countryData.currency.code
    rate.textContent = " Currency rate: " + countryData.currency.rate
    languageSpoken.textContent = " Language spoken: " + countryData.language[0].language
    // electricity.textContent = searchHistory.electricity
    volt.textContent = " Voltage: " + countryData.electricity.voltage
    frequency.textContent = " Electricity frequency: " + countryData.electricity.frequency
    waterQuality.textContent = " Water Status: " + countryData.water.short


    countryInfo.append(heading, infoList);
    infoList.append(unorderedList);

    // Option 2 to keep it more neat
    unorderedList.append(countryName,
        currency,
        rate,
        languageSpoken,
        electricity,
        volt,
        frequency,
        waterQuality,
        tempEl,
        feelsLikeEl,
        humidityEl,
        weatherIconLiEL)

    emergency();

    neighboringCountries();

    // shows go back button
    document.getElementById("goBack").style.display = "block";

    // Hides progress bar
    progressBarEl.style.display = "none";

};

// shows go back button
document.getElementById("goBack").style.display = "block";

// Hides progress bar
progressBarEl.style.display = "none";

function emergency() {
    infoListEl.innerHTML = "";
    var heading = document.createElement("h1");
    var infoList = document.createElement("div");
    var unorderedList = document.createElement("ul");
    var emergencyNumbers = document.createElement("li");
    var callingCode = document.createElement("li");
    var police = document.createElement("li");
    var ambulance = document.createElement("li");
    var fire = document.createElement("li");

    heading.textContent = "Emergency Telephone Numbers "
    callingCode.textContent = " Calling Code: " + countryData.telephone.calling_code
    police.textContent = " Police: " + countryData.telephone.police
    ambulance.textContent = " Ambulance: " + countryData.telephone.ambulance
    fire.textContent = " Fire: " + countryData.telephone.fire

    infoListEl.append(heading, infoList);
    infoList.append(unorderedList);
    unorderedList.appendChild(emergencyNumbers);
    unorderedList.appendChild(callingCode);
    unorderedList.appendChild(police);
    unorderedList.appendChild(ambulance);
    unorderedList.appendChild(fire);
};


function neighboringCountries() {
    NextDoor.innerHTML = "";
    // console.log(neighboringCountries)
    var heading = document.createElement("h1");
    var infoList = document.createElement("div");
    var unorderedList = document.createElement("ul");
    var neighborsTitle = document.createElement("li");
    var neighbor1 = document.createElement("li");
    var neighbor2 = document.createElement("li");
    var neighbor3 = document.createElement("li");
    var neighbor4 = document.createElement("li");
    heading.textContent = "Neighboring Countries"
    // Commenting these out, content displayed on button instead
    // neighbor1.textContent = countryData.neighbors[0].name
    // neighbor2.textContent = countryData.neighbors[1].name
    // neighbor3.textContent = countryData.neighbors[2].name
    // neighbor4.textContent = countryData.neighbors[3].name

    NextDoor.append(heading, infoList);
    infoList.append(unorderedList);
    unorderedList.appendChild(neighborsTitle);
    unorderedList.appendChild(neighbor1);
    unorderedList.appendChild(neighbor2);
    unorderedList.appendChild(neighbor3);
    unorderedList.appendChild(neighbor4);

    // convert neighbor countries to button with hyper link to display that country's info
    var neighbor1Btn = document.createElement("a");
    var neighbor2Btn = document.createElement("a");
    var neighbor3Btn = document.createElement("a");
    var neighbor4Btn = document.createElement("a");
    neighbor1.append(neighbor1Btn);
    neighbor2.append(neighbor2Btn);
    neighbor3.append(neighbor3Btn);
    neighbor4.append(neighbor4Btn);
    neighbor1Btn.classList.add("waves-effect", "waves-light", "btn", "neighbourBtn");
    neighbor2Btn.classList.add("waves-effect", "waves-light", "btn", "neighbourBtn");
    neighbor3Btn.classList.add("waves-effect", "waves-light", "btn", "neighbourBtn");
    neighbor4Btn.classList.add("waves-effect", "waves-light", "btn", "neighbourBtn");
    neighbor1Btn.textContent = countryData.neighbors[0].name
    neighbor2Btn.textContent = countryData.neighbors[1].name
    neighbor3Btn.textContent = countryData.neighbors[2].name
    neighbor4Btn.textContent = countryData.neighbors[3].name

    let neighbourBtnAll = document.querySelectorAll(".neighbourBtn");
    neighbourBtnAll.forEach(function(neighborBtnEach) {
        neighborBtnEach.addEventListener('click', btnFetchCountryData);
    })
};

init();
