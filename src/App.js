import React, { useState } from "react";
import axios from "axios";
import { FaSearch } from 'react-icons/fa';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const url = "https://api.openweathermap.org/data/2.5/weather";

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(`${url}?q=${location}&units=imperial&appid=c52b6288f10cbde9a8fc4c9228004311`)
        .then((response) => {
          setData(response.data);
          setSearchHistory(prevHistory => {
            const updatedHistory = [location, ...prevHistory];
            // Remove duplicates
            return [...new Set(updatedHistory)].slice(0, 5); // Limit history to 5 items
          });
          setLocation("");
          setShowHistory(false); // Hide history after search
        })
        .catch((error) => {
          console.error("Error fetching weather data", error);
        });
    }
  };

  const handleHistoryClick = (searchTerm) => {
    setLocation(searchTerm);
    searchLocation({ key: 'Enter' }); // Trigger search for the selected term
  };

  return (
    <div className="app">
      <div className="search" onClick={() => setShowHistory(true)}>
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
          onBlur={() => setTimeout(() => setShowHistory(false), 200)} // Delay to allow click on history item
        />
        <FaSearch className="search-icon" />
        {showHistory && searchHistory.length > 0 && (
          <div className="search-history">
            {searchHistory.map((term, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => handleHistoryClick(term)}
              >
                {term}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed(1)}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className="bold">{data.main.feels_like.toFixed(1)}°F</p> : null}
              <p>Feels like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed(1)}MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
