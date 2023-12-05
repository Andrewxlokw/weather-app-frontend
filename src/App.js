import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  // const cityName = "Sample City 11"; // Replace with dynamic data
  // const regionName = "Sample Region 11"; // Replace with dynamic data

  const [inputCityName, setInputCityName] = useState(''); // State for the input city name
  const [displayedCityName, setDisplayedCityName] = useState('Ottawa'); // State for the displayed city name
  const [unit, setUnit] = useState('Celsius'); // State for the unit selection
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true); // Simple auth state, set this to false later !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // const [weatherData, setWeatherData] = useState({
  //   icon: '', // URL to weather icon
  //   temperature: '',
  //   condition: '',
  //   windSpeed: '',
  //   humidity: '',
  // });

  
  const [weatherData, setWeatherData] = useState({
    icon: '/website_logo.png', // URL to weather icon
    temperature: '1.0',
    condition: 'goood',
    windSpeed: '1145',
    humidity: '14',
  });
  
 
  // const [activityRecommendation, setActivityRecommendation] = useState({
  //   text: '', // Text for the recommendation
  //   iconName: '', // Name of the Bootstrap icon
  // });
  
  const [activityRecommendation, setActivityRecommendation] = useState({
    text: 'sadasfkasklms,czxcs', // Text for the recommendation
    iconName: 'bi-0-circle', // Name of the Bootstrap icon
  });
  

  const handleCityChange = (e) => {
    setInputCityName(e.target.value);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const handleSubmit = () => {
    setDisplayedCityName(inputCityName); // Update displayed city name
    fetchWeatherData(inputCityName, unit);
    console.log("Getting weather for: ", inputCityName, unit);
  };

  const handleSetDefaultLocation = () => {
    // Implement the logic to send the city name to the backend
    console.log("Sending city to backend: ", inputCityName);
    // Example: fetch('/api/set-default-location', { method: 'POST', body: JSON.stringify({ cityName }) });
  };

  const fetchWeatherData = (city, currentUnit) => {
    // Replace with your API endpoint
    const url = new URL('http://127.0.0.1:8000/api/weather-data'); // Replace with your actual API URL
    url.search = new URLSearchParams({ city: displayedCityName, unit }).toString();
    
    const convertUnit = currentUnit === 'Celsius' ? 'metric' : 'imperial';

    // fetch('http://127.0.0.1:8000/api/weather-data?city=' + encodeURIComponent(city) + '&unit=' + currentUnit)
    fetch('http://127.0.0.1:8000/api/weather-data?city=' + encodeURIComponent(city) + '&unit=' + convertUnit)
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        // Assuming 'data' is the object containing weather information
        setWeatherData({
          temperature: data.temperature,
          condition: data.condition,
          icon: data.icon,
          humidity: data.humidity,
          windSpeed: data.wind_speed,
          // ... set other pieces of weather data as needed ...
        });
      })
      .catch(error => console.error('Error fetching weather data:', error));
  };

  const fetchActivityRecommendation = () => {
    fetch('/api/activity-recommendation') // Your API endpoint
      .then(response => response.json())
      .then(data => setActivityRecommendation({
        text: data.text,
        iconName: data.iconName // Make sure the backend sends the correct icon class
      }))
      .catch(error => console.error('Error fetching activity recommendation:', error));
  };


  // Call this function when the city is set or unit changes
  useEffect(() => {
    fetchWeatherData(displayedCityName, unit);
    // fetchActivityRecommendation();
  }, [displayedCityName, unit]);

  
  // "/website_logo.png"
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/website_logo.png"
              width="110"  
              height="auto"  
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="/signin">Sign In</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="location-bar"> 
        <Container>
          My Location:
          <input 
            type="text" 
            value={inputCityName} 
            onChange={handleCityChange}
            placeholder="Enter city name"
          />
          <select value={unit} onChange={handleUnitChange}>
            <option value="Celsius">Celsius</option>
            <option value="Fahrenheit">Fahrenheit</option>
          </select>
          <button onClick={handleSubmit}>Get Weather</button>
        </Container>
      </div>

      <div className="weather-city"> 
        <Container className="mt-4">
          {/* <h2>{cityName}, {regionName}</h2> */}
          <h2>{displayedCityName}</h2>
        </Container>
      </div>

      <Container className="mt-4 weather-info">
        <h2>{displayedCityName}</h2>
        {isUserLoggedIn && (
          <button 
            className="btn btn-primary ml-3"
            onClick={handleSetDefaultLocation}
          >
            Set As Default Location
          </button>
        )}
      </Container>
      

      {/* <div className="weather-info">
        <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
        <div className="temperature-display">
          {weatherData.temperature} {unit === 'Celsius' ? '°C' : '°F'}
        </div>
        <ul className="weather-details">
          <li>Condition: {weatherData.condition}</li>
          <li>Wind Speed: {weatherData.windSpeed} km/h</li>
          <li>Humidity: {weatherData.humidity}%</li>
        </ul>
      </div> */}
      

      <div className="weather-info">
        <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
        <div className="temperature-display">
          {weatherData.temperature} {unit === 'Celsius' ? '°C' : '°F'}
        </div>
        <ul className="weather-details">
        <li>
          <div className="label">Weather Condition: </div> 
          <div className="value">{weatherData.condition}</div>
        </li>
        <li>
          <div className="label">Wind Speed: </div> 
          <div className="value">{weatherData.windSpeed} km/h</div>
        </li>
        <li>
          <div className="label">Humidity: </div> 
          <div className="value">{weatherData.humidity} %</div>
        </li>
        </ul>
      </div>

    <div className="activity-recommendation-section">
      <div className="recommendation-text">
        <h5>Outdoor Activity Recommendation</h5>
        <p>{activityRecommendation.text}</p>
      </div>
      <div className="recommendation-icon">
        {/* Replace 'activity-icon' with actual icon class based on recommendation */}
        <i className={`bi ${activityRecommendation.iconName}`}></i> 
        {/* <i class="bi bi-check-circle"></i> */}
      </div>
    </div>


    </div>
  );
}


export default App;
