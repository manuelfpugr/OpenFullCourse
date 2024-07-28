import { useEffect, useState } from 'react'
import communication from './communication'
import './App.css'

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [exactMatchCountry, setExactMatchCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    communication
      .getList()
      .then(response => {
        if (Array.isArray(response.data)) {
          setCountries(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      })
      .catch(error => console.log('Error:', error));
  }, []);

  useEffect(() => {
    if (search) {
      const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );

      const exactMatch = filteredCountries.find(country =>
        country.name.common.toLowerCase() === search.toLowerCase()
      );

      if (exactMatch) {
        setExactMatchCountry(exactMatch);
      } else {
        setExactMatchCountry(null);
      }
    } else {
      setExactMatchCountry(null);
    }
  }, [search, countries]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleShowDetails = (country) => {
    setSelectedCountry(country);
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (selectedCountry) {
      const capital = selectedCountry.capital[0];
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => response.json())
        .then(data => setWeather(data))
        .catch(error => console.log('Error:', error));
    }
  }, [selectedCountry, api_key]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search for a country"
      />
      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} km²</p>
          <p>Languages: {Object.values(selectedCountry.languages).join(', ')}</p>
          <img src={selectedCountry.flags.png} alt={`Flag of ${selectedCountry.name.common}`} width="100" />
          {weather && (
            <div>
              <h3>Weather in {selectedCountry.capital}</h3>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Weather: {weather.weather[0].description}</p>
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
            </div>
          )}
          <button onClick={() => setSelectedCountry(null)}>Back</button>
        </div>
      ) : (
        <div>
          {filteredCountries.length > 10 ? (
            <p>Too many matches, specify another filter</p>
          ) : (
            <ul>
              {filteredCountries.map(country => (
                <li key={country.name.common}>
                  {country.name.common}
                  <button onClick={() => handleShowDetails(country)}>Show details</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;