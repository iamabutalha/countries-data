import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const api_key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((resp) => {
        // console.log(resp.data);
        setCountries(resp.data);
      });
  }, []);

  // useEffect(() => {
  //   console.log("countries", countries);
  // }, [countries]);

  useEffect(() => {
    if (filter.length === 1) {
      // if the length of filter countries is 1 mean only one country in the array then fetch the weather data for that country
      const lat = filter[0].latlng[0];
      const lon = filter[0].latlng[1];
      renderWeather(lat, lon);
    }
  }, [value, countries]);

  const handleChange = (e) => {
    setValue(e.target.value);
    setSelectedCountry(null);
    setWeatherData(null);
  };

  const renderWeatherIcon = () => {
    if (weatherData && weatherData.current) {
      const iconCode = weatherData.current.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      return <img src={iconUrl} alt="" />;
    }
    return <p>Loading weather Data</p>;
  };

  let filter = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(value.toLowerCase());
  });
  // console.log("filter", filter);

  // function
  let renderCountry = () => {
    if (filter.length > 10) {
      return <p>Too many Countries </p>;
    } else if (filter.length === 1) {
      return (
        <div>
          <h1>{filter[0].name.common}</h1>
          <p>{filter[0].capital[0]}</p>
          <p>area {filter[0].area}</p>
          <ul>
            {Object.values(filter[0].languages).map((language, index) => {
              return <li key={index}>{language}</li>;
            })}
          </ul>
          <img src={filter[0].flags.png} alt="" />
          {weatherData ? (
            <div>
              <h1>Weather in {filter[0].capital}</h1>
              <strong>
                temprature {toCelcius(weatherData.current.temp)} &deg;C
              </strong>
              {renderWeatherIcon()}
              <p>wind {weatherData.current.wind_speed} m/s </p>
            </div>
          ) : (
            <p>Loading weather Data</p>
          )}
        </div>
      );
    } else if (filter.length <= 10) {
      return filter.map((country, index) => {
        return (
          <>
            <p key={country.name.common}>{country.name.common}</p>
            <button onClick={() => showButtonOnclick(country)}>show</button>
          </>
        );
      });
    }
  };

  const showButtonOnclick = (country) => {
    setSelectedCountry(country);
  };

  async function weather(lat, lon) {
    let response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${api_key}`
    );
    // console.log(response.data);
    return response.data;
  }

  async function renderWeather(lat, lon) {
    const weather2 = await weather(lat, lon);
    setWeatherData(weather2);
  }

  const toCelcius = (kelvin) => (kelvin - 273.15).toFixed(2);

  return (
    <div>
      find countries <input value={value} onChange={handleChange} />
      {renderCountry()}
      {selectedCountry && (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>{selectedCountry.capital}</p>
          <img src={selectedCountry.flags.png} alt="" />
        </div>
      )}
    </div>
  );
}

// (
//   filter
//     .map((country) => {
//       return <p>{country.name.common}</p>;
//     })
//     .join(" ")

export default App;
