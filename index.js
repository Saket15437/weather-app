const  userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfo = document.querySelector(".user-info-container");


let currentTab = userTab;
const API_KEY = "8109990ce4c365bc2ddf1b3f3b9f18a1";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(currentTab){
   if(clickedTab != currentTab){
    // kya search form wala tab invisible hai, if yes make it visible
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    if(!searchForm.classList.contains("active")){
        userInfo.classList.remove("active");
        grantAccess.classList.remove("active");
        searchForm.classList.add("active");
    }
    //mai phele search wale tab pr tha, ab your weather tab visible krna hai
    else{
        searchForm.classList.remove("active");
        userInfo.classList.remove("active");
        // ab mai your weather tab me aagya hu, toh weather bi display krna padega
        getfromSessionStorage();
    }
   }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

//check if cordinates are already present in session storage

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }
    else{
     const coordinates = JSON.parse(localCoordinates);
     fetchUserWeatherInfo(coordinates);

    }
}

 async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grantContainer invisible
   grantAccess.classList.remove("active");
   // make loader visible
   loadingScreen.classList.add("active");

   //API CALL
    try {
        const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
       const  data = await response.json();
    loadingScreen.classList.remove("active");    
    userInfo.classList.add("active");
    renderWeatherInfo(data);    
 
    } 
    catch (error) {
        loadingScreen.classList.remove("active");
        
    }

}
function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements
     const cityName= document.querySelector("[data-cityName]");
 const countryIcon = document.querySelector("[data-countryIcon]");
 const desc = document.querySelector("[data-weatherDesc]");
 const weatherIcon = document.querySelector("[data-weatherIcon]");
 const temp = document.querySelector("[data-temp]");
 const windspeed = document.querySelector("[data-windspeed]");
 const humidity = document.querySelector("[data-humidity]");
 const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherinfo object and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  desc.innerText = weatherInfo?.weather?.[0]?.description;
 weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png
 `;
 temp.innerText = weatherInfo?.main?.temp;
 windspeed.innerText = weatherInfo?.wind?.speed;
 humidity.innerText = weatherInfo?.main?.humidity;
 cloudiness.innerText = weatherInfo?.clouds?.all;

}



function getlocation(){
    if(navigator.geolocation){
     navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
    
    }
}


function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getlocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "") 
        return ;
    
    else 
        fetchSearchWeatherInfo(cityName);
    
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfo.classList.remove("active");
    grantAccess.classList.remove("active");
    

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfo.classList.add("active")
    renderWeatherInfo(data);
  } 
  catch (error) {
    
  }

}