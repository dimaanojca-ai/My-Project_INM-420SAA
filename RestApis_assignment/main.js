console.log("hello main.js");

// API Key
const apiKey = "8085d94c669d438493d220501260802";

// Function to generate dynamic URL
function generateAstronomyApiUrl(city, apiKey) {
  return `https://api.weatherapi.com/v1/astronomy.json?q=${city}&key=${apiKey}`;
}

// Function to get astronomy details from the API
async function getAstronomyDetails(city) {
  const url = generateAstronomyApiUrl(city, apiKey);
  const response = await fetch(url);
  const jsonResponse = await response.json();

  console.log('json data from API', jsonResponse);

  // Extract necessary values from the API response
  const { name, region, country, localtime} = jsonResponse.location;
  const { sunrise, sunset, moon_phase, moon_illumination } = jsonResponse.astronomy.astro;

  // Display the data
  displayLocationInfo(name, region, country,localtime);
  displayAstronomyInfo(sunrise, sunset, moon_phase, moon_illumination);
}

// Function to display location information
function displayLocationInfo(city, region, country,localtime) {
  const locationDiv = document.getElementById('location-info');
  locationDiv.innerHTML = `
    <h2>${city}</h2>
    <p><strong>Region:</strong> ${region}</p>
    <p><strong>Country:</strong> ${country}</p>
    <p><strong>Local Time:</strong> ${localtime}</p>
  `;
}

// Function to display astronomy information
function displayAstronomyInfo(sunrise, sunset, moonPhase, moonLight) {
  const astronomyDiv = document.getElementById('astronomy-info');
  astronomyDiv.innerHTML = `
    <h3>Astronomy Data</h3>
    <p><strong>Sunrise:</strong> ${sunrise}</p>
    <p><strong>Sunset:</strong> ${sunset}</p>
    <p><strong>Moon Phase:</strong> ${moonPhase}</p>
    <p><strong>Moon Illumination:</strong> ${moonLight}%</p>
  `;
}

// Load initial data for Toronto, Canada
getAstronomyDetails('Toronto');

// Get the dropdown element and add event listener
const citySelect = document.getElementById('city-select');
citySelect.addEventListener('change', function () {
  const selectedCity = this.value;
  console.log('Selected city:', selectedCity);
  getAstronomyDetails(selectedCity);
});