import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';


function App() {

  const [inputCityName, setInputCityName] = useState('');               // State for the input city name
  const [displayedCityName, setDisplayedCityName] = useState('vancouver'); // State for the displayed city name Ottawa
  const [unit, setUnit] = useState('Celsius');                          // State for the unit selection

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Simple auth state
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [signUpCredentials, setSignUpCredentials] = useState({ username: '', password: '' });

  const [darkMode, setDarkMode] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [weatherData, setWeatherData] = useState({
    icon: '', // URL to weather icon
    temperature: '',
    condition: '',
    windSpeed: '',
    humidity: '',
  });

  const [activityRecommendation, setActivityRecommendation] = useState({
    text: '', // Text for the recommendation
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

  const handleIncorrectCityName = () => {
    setShowAlert(true);
    setAlertMessage("The city name entered is empty or incorrect. Please try again.");
  };

  const handleIncorrectLogin = () => {
    setShowAlert(true);
    setAlertMessage("The username entered does not exist or match the password. Please try again.");
  };

  const handleIncorrectSignUp = () => {
    setShowAlert(true);
    setAlertMessage("The username entered is already existed. Please try a new username.");
  };

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

  const handleSignUpInputChange = (event) => {
    setSignUpCredentials({ ...signUpCredentials, [event.target.name]: event.target.value });
  };

  const toggleSignUpForm = () => {
    setShowSignUpForm(!showSignUpForm); // Toggle sign-up form visibility
    setShowLoginForm(false); // Ensure login form is hidden
  };


  function getCsrfToken() {
      return document.cookie.split('; ')
          .find(row => row.startsWith('csrftoken'))
          ?.split('=')[1];
  }
  const csrfToken = getCsrfToken();


  const handleSetDefaultLocation = () => {
    // Implement the logic to send the city name to the backend
    console.log("Sending city name to backend: ", inputCityName);
    fetch('http://127.0.0.1:8000/api/set-default-city/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include CSRF token in the request header
        },
        body: JSON.stringify({ default_city: inputCityName }),
        credentials: 'include' 
    })
    .then(response =>{
      console.log("response is:", response.json());
    })
    .then(data => {
        if (data.success) {
            // Handle success
            console.log("Default city set to:", data.default_city);
        } else {
            // Handle failure
            console.log('Data error:', data.success);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  };


  const fetchWeatherData = (city, currentUnit) => {
    // fetch weather data from django and display the information on website
    const convertUnit = currentUnit === 'Celsius' ? 'metric' : 'imperial';

    fetch('http://127.0.0.1:8000/api/weather-data?city=' + encodeURIComponent(city) + '&unit=' + convertUnit, {credentials: "include"})
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        console.log("data.error Response:", data.error);
        
        if(data.error == undefined){
          setWeatherData({
            temperature: data.temperature,
            condition: data.condition,
            icon: data.icon,
            humidity: data.humidity,
            windSpeed: data.wind_speed,
          });
          setActivityRecommendation({
            text: data.activity,
          });
          console.log("check, weatherData.weatherCode is", data.id);
          if (SEVERE_WEATHER_CODES.has(data.id)) {
            // Display alert for severe weather
            alert("Severe weather alert! Please be cautious.");
          }
          setShowAlert(false);
        }
        else{
          console.log('handleIncorrectCityName');
          handleIncorrectCityName ();
        }
      })
      .catch(error => {
        console.log('Error fetching weather data:', error);
        handleIncorrectCityName();
      });
  };



  // login feature
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

  // source: https://stackoverflow.com/questions/50732815/how-to-use-csrf-token-in-django-restful-api-and-react
  const handleLogin = (event) => {

    const apiUnit = unit === 'Celsius' ? 'metric' : 'imperial'; //set default unit to celsius
    const csrfToken = getCsrfToken('csrftoken');
    event.preventDefault(); // Prevent form from reloading the page

    fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginCredentials),
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setIsUserLoggedIn(true);
        setShowLoginForm(false);
        fetchDefaultCity(data.token);
      } 
      else {
        alert('Invalid Credentials');
        handleIncorrectLogin();
      }
    })
  };


  const handleLogout = () => {
    fetch('http://127.0.0.1:8000/api/logout/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
      },
      credentials: 'include' 
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
            
        }
        else{
          alert('log out failed');
        }
    })
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    console.log('signUpCredentials.username is', signUpCredentials.username);
    console.log('signUpCredentials.password is', signUpCredentials.password);
    fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: signUpCredentials.username,
            password1: signUpCredentials.password,
            password2: signUpCredentials.password,
        }),
    })
    .then(response => {
      console.log('signup response is', response);
        if (response.ok) {
            return response.json();
        }
        handleIncorrectSignUp();
    })
    .then(data => {
        console.log('Sign-up successful:', data);
    })
    .catch(error => {
        console.error('Error during sign-up:', error);
    });
  };

  // Call this function when the city is set, unit changes or dark/light mode changes
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
      if (darkMode) {
        document.body.classList.add("dark-mode");
      } else {
          document.body.classList.remove("dark-mode");
      }
  }, [darkMode]);

  

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
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="ms-auto">
                      <Nav.Link onClick={toggleLoginForm} className="nav-link-hover">Sign In</Nav.Link>
                      <Nav.Link onClick={toggleSignUpForm} className="nav-link-hover">Sign Up</Nav.Link>
                      {isUserLoggedIn && (
                          <button onClick={handleLogout} className="btn ms-2">
                              Logout
                          </button>
                      )}
                      <button onClick={() => setDarkMode(!darkMode)} className="btn ms-2">
                          Toggle {darkMode ? 'Light' : 'Dark'} Mode
                      </button>
                  </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>

      {showAlert && (
        <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
        </Alert>
      )}
      {showSignUpForm && (
        <form onSubmit={handleSignUp}>
            <input
                type="text"
                name="username"
                value={signUpCredentials.username}
                onChange={handleSignUpInputChange}
                placeholder="Username"
            />
            <input
                type="password"
                name="password"
                value={signUpCredentials.password}
                onChange={handleSignUpInputChange}
                placeholder="Password"
            />
            <button type="submit">Sign Up</button>
        </form>
      )}
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


      <Container className="mt-4 weather-info">
        <h2>{displayedCityName}</h2>
        {isUserLoggedIn && (
          <button 
            className="btn btn-secondary ms-2 "
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
      </div>
    </div>
  );
}


export default App;
