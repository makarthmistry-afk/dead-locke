import { useState, useEffect } from 'react';
import weatherApi from '../services/weatherApi';

const useWeather = (city, units = 'metric') => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airPollution, setAirPollution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [weatherRes, forecastRes] = await Promise.all([
          weatherApi.getCurrentWeather(city, units),
          weatherApi.getForecast(city, units)
        ]);

        setCurrentWeather(weatherRes.data);
        setForecast(forecastRes.data);

        // Fetch air pollution data if coordinates are available
        if (weatherRes.data.coord) {
          try {
            const pollutionRes = await weatherApi.getAirPollution(
              weatherRes.data.coord.lat,
              weatherRes.data.coord.lon
            );
            setAirPollution(pollutionRes.data);
          } catch (err) {
            console.log('Air pollution data not available');
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch weather data');
        setCurrentWeather(null);
        setForecast(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, units]);

  return { currentWeather, forecast, airPollution, loading, error };
};

export default useWeather;
