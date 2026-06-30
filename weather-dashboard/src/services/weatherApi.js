import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';

const weatherApi = {
  // Get current weather by city name
  getCurrentWeather: (city, units = 'metric') => {
    return axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: units
      }
    });
  },

  // Get current weather by coordinates
  getCurrentWeatherByCoords: (lat, lon, units = 'metric') => {
    return axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: units
      }
    });
  },

  // Get 5-day forecast
  getForecast: (city, units = 'metric') => {
    return axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: units
      }
    });
  },

  // Get 5-day forecast by coordinates
  getForecastByCoords: (lat, lon, units = 'metric') => {
    return axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: units
      }
    });
  },

  // Get air pollution data
  getAirPollution: (lat, lon) => {
    return axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY
      }
    });
  },

  // Get UV index
  getUVIndex: (lat, lon) => {
    return axios.get(`${BASE_URL}/uvi`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY
      }
    });
  }
};

export default weatherApi;
