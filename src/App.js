import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  // const cityName = "Sample City 11"; // Replace with dynamic data
  // const regionName = "Sample Region 11"; // Replace with dynamic data

  const [inputCityName, setInputCityName] = useState('');               // State for the input city name
  const [displayedCityName, setDisplayedCityName] = useState('vancouver'); // State for the displayed city name Ottawa
  const [unit, setUnit] = useState('Celsius');                          // State for the unit selection

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Simple auth state, set this to false later !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

  
  // const [weatherData, setWeatherData] = useState({
  //   icon: '', // URL to weather icon
  //   temperature: '',
  //   condition: '',
  //   windSpeed: '',
  //   humidity: '',
  // });

  // Replace with dynamic data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

  // Replace with dynamic data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const [activityRecommendation, setActivityRecommendation] = useState({
    text: 'sadasfkasklms,czxcs', // Text for the recommendation
    iconName: 'bi-0-circle', // Name of the Bootstrap icon
  });

  const SEVERE_WEATHER_CODES = new Set([
    // Thunderstorm
    200, 201, 202,  
    210, 211, 212, 
    221,  
    230, 231, 232, 
    // Rain 
    502, 503, 504,  
    511, 520, 521, 522, 
    531,  
    // Heavy snow and Sleet
    602,  
    611, 612, 613,  
    615, 616,
    620, 621, 622,
    // Rare weather
    711,  // Smoke
    731,  // Dust whirls
    751,  // Sand
    761,  // Dust
    762,  // Volcanic ash
    771,  // Squalls
    781,  // Tornado
  ]);

  const handleCityChange = (e) => {
    setInputCityName(e.target.value);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const handleSubmit = () => {
    setDisplayedCityName(inputCityName); // Update displayed city name
    fetchWeatherData(inputCityName, unit);
    console.log("Getting weather for this city: ", inputCityName, unit);
  };

  
  function getCsrfToken() {
      return document.cookie.split('; ')
          .find(row => row.startsWith('csrftoken'))
          ?.split('=')[1];
  }
  const csrfToken = getCsrfToken();
  // console.log("csrfToken is ",csrfToken);
  const handleSetDefaultLocation = () => {
    // Implement the logic to send the city name to the backend
    console.log("Sending city name to backend: ", inputCityName);
    // Example: fetch('/api/set-default-location', { method: 'POST', body: JSON.stringify({ cityName }) });

    fetch('http://127.0.0.1:8000/api/set-default-city/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include CSRF token in the request header
        },
        body: JSON.stringify({ default_city: inputCityName }),
        credentials: 'include' // If using cookies for session management
    })
    // .then(response => response.json())
    .then(response =>{
      console.log("response is:", response.json());
    })
    .then(data => {
        if (data.success) {
            console.log("Default city set to:", data.default_city);
            // Handle successful update
        } else {
            // Handle failure
            alert('data error:', data.success);
            // alert(data.message)
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  };


  const fetchActivityRecommendation = (weatherCode) => {
    fetch(`http://127.0.0.1:8000/api/activity-recommendation/${weatherCode}/`, {credentials: "include"})
      .then(response => {
        console.log("response is:", response)
        return response.json()})
      .then(data => {
        console.log("data activity is:", data.activity)
        setActivityRecommendation({
          text: data.activity_recommendation,
          // iconName: mapWeatherCodeToIcon(data.activity_recommendation) // You'll need to implement this mapping
        });
      })
      .catch(error => console.error('Error fetching activity recommendation:', error));
  };


  const fetchWeatherData = (city, currentUnit) => {
    // const url = new URL('http://127.0.0.1:8000/api/weather-data'); 
    // url.search = new URLSearchParams({ city: displayedCityName, unit }).toString();
    
    const convertUnit = currentUnit === 'Celsius' ? 'metric' : 'imperial';

    // fetch('http://127.0.0.1:8000/api/weather-data?city=' + encodeURIComponent(city) + '&unit=' + currentUnit)
    fetch('http://127.0.0.1:8000/api/weather-data?city=' + encodeURIComponent(city) + '&unit=' + convertUnit, {credentials: "include"})
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        console.log("data.icon Response:", data.icon);
        // Assuming 'data' is the object containing weather information
        setWeatherData({
          temperature: data.temperature,
          condition: data.condition,
          icon: data.icon,
          humidity: data.humidity,
          windSpeed: data.wind_speed,
          // ... set other pieces of weather data as needed ...
        });
        setActivityRecommendation({
          text: data.activity,
          // iconName: 'bi-0-circle' // Update this as per your mapping of activity to icon
        });
        console.log("check, weatherData.weatherCode is", data.id);
        if (SEVERE_WEATHER_CODES.has(data.id)) {
          // Display alert for severe weather
          alert("Severe weather alert! Please be cautious.");
        }
      })
      .catch(error => console.error('Error fetching weather data:', error));
      // console.log("weatherData.weatherCode is", data.weatherCode);
    // fetchActivityRecommendation(weatherData.weatherCode);
  };

  // const fetchActivityRecommendation = () => {
  //   fetch('/api/activity-recommendation') 
  //     .then(response => response.json())
  //     .then(data => setActivityRecommendation({
  //       text: data.text,
  //       iconName: data.iconName // Make sure the backend sends the correct icon class
  //     }))
  //     .catch(error => console.error('Error fetching activity recommendation:', error));
  // };



  // login feature
  // const handleLoginInputChange = (e) => {
  //   setLoginCredentials({ ...loginCredentials, [e.target.name]: e.target.value });
  // };
  
  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };
  const fetchDefaultCity = (token) => {
    fetch('http://127.0.0.1:8000/api/get-default-city/', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      const defaultCity = data.default_city || 'Kingston';
      setDisplayedCityName(defaultCity);
      fetchWeatherData(defaultCity, 'metric'); // Assuming 'metric' as default unit
    })
    .catch(error => console.error('Error fetching default city:', error));
};

  // https://stackoverflow.com/questions/50732815/how-to-use-csrf-token-in-django-restful-api-and-react
  const handleLogin = (event) => {
    // const csrfToken = getCsrfToken();

    const apiUnit = unit === 'Celsius' ? 'metric' : 'imperial';

    const csrfToken = getCsrfToken('csrftoken');
    event.preventDefault(); // Prevent form from reloading the page

    fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(loginCredentials),
      credentials: 'include'
      // body: JSON.stringify({
      //   username: 'user_test1',
      //   password: 'Aa12345678'
      // }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setIsUserLoggedIn(true);
        setShowLoginForm(false);


        // const defaultCity = data.default_city || 'Kingston';
        // fetchWeatherData(defaultCity, apiUnit);
        // setDisplayedCityName(defaultCity)
        // localStorage.setItem('token', data.token);

        fetchDefaultCity(data.token);
        // alert('Good Credentials');
        console.log('Good Credentials');
      } 
      else {
        alert('Invalid Credentials');
      }
    })
    // .catch(error => {
    //   console.error('Error:', error);
    // });
  };



  const handleLogout = () => {
    fetch('http://127.0.0.1:8000/api/logout/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
      },
      credentials: 'include' // Needed to include the session cookie
    })
    .then(response => {
      if (!response.ok) {
          throw new Error('Logout failed');
      }
      console.log("logout response is successfully");
      return response.json();
    })
    .then(data => {
        console.log("data is successfully", data.success);
        if (data.success) {
            
            console.log("Logged out successfully");
            localStorage.removeItem('token');
            setIsUserLoggedIn(false);
            
            // Redirect or update UI as needed
            // Refresh the page
            // window.location.reload();
        }
        else{
          alert('log out failed');
        }
    })
    .catch(error => {
        // console.error('Logout error:', error);
    });
    // localStorage.removeItem('token');
    // setIsUserLoggedIn(false);
  };

  // Call this function when the city is set or unit changes

  useEffect(() => {
      fetch('http://127.0.0.1:8000/api/check-login-status/', {
          credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
          setIsUserLoggedIn(data.is_logged_in);
          console.log('data.is_logged_in is', data.is_logged_in)
          if (data.is_logged_in) {
              // Fetch the default city or perform other actions as needed
              fetchDefaultCity();
          }
      })
      .catch(error => console.error('Error:', error));
  }, []);

  
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
            {/* <Nav.Link href="/signin">Sign In</Nav.Link> */}
            <Nav.Link onClick={toggleLoginForm}>Sign In</Nav.Link>
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


      <div className="weather-info">
        <img src={`http://openweathermap.org/img/wn/${weatherData.icon}.png`} alt="Weather Icon" className="weather-icon" />
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
        <img src={`http://openweathermap.org/img/wn/${weatherData.icon}.png`} alt="weather icon"></img>
        {/* <i class="bi bi-check-circle"></i> */}
      </div>
    </div>

  {showLoginForm && (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={loginCredentials.username}
        onChange={e => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
        placeholder="Username"
      />
      <input
        type="password"
        value={loginCredentials.password}
        onChange={e => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )}
  {/* <button onClick={handleLogout}>Logout</button> */}
  {isUserLoggedIn && <button onClick={handleLogout}>Logout</button>}


    </div>
  );

}


export default App;
