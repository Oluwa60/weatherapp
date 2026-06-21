import { useEffect, useState } from 'react'
import './App.css'

const cityOptions = [
  'Akure, NG',
  'Lagos, NG',
  'Ibadan, NG',
  'San Francisco, CA',
  'New York, NY',
  'London, UK',
  'Tokyo, JP',
  'Sydney, AU',
  'Abuja, NG',
]

const weatherCodeLabels = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

function getWeatherLabel(code) {
  return weatherCodeLabels[code] || 'Unknown weather'
}

function normalizeCityName(city) {
  return city.split(',')[0].trim()
}

function HeroSec() {
  const [query, setQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState(cityOptions[0])
  const [locationLabel, setLocationLabel] = useState(cityOptions[0])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWeather(normalizeCityName(cityOptions[0]))
  }, [])

  async function fetchWeather(cityName) {
    setLoading(true)
    setError('')

    try {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
      const geocodeResponse = await fetch(geocodeUrl)
      const geocodeData = await geocodeResponse.json()

      if (!geocodeData.results || geocodeData.results.length === 0) {
        throw new Error('City not found. Try another search.')
      }

      const location = geocodeData.results[0]
      const labelParts = [location.name, location.admin1, location.country].filter(Boolean)
      const label = labelParts.join(', ')
      setLocationLabel(label)

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&timezone=auto`
      const weatherResponse = await fetch(weatherUrl)
      const weatherData = await weatherResponse.json()

      if (!weatherData.current_weather) {
        throw new Error('Unable to load current weather for this location.')
      }

      setWeather({
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        winddirection: weatherData.current_weather.winddirection,
        weathercode: weatherData.current_weather.weathercode,
        description: getWeatherLabel(weatherData.current_weather.weathercode),
        time: weatherData.current_weather.time,
        forecast: weatherData.forecast,
      })
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load weather data.')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  function handleSearchClick() {
    const searchTerm = query.trim() || normalizeCityName(selectedCity)
    if (!searchTerm) {
      setError('Enter a city name or select from the list.')
      return
    }
    fetchWeather(searchTerm)
  }

  function handleCityChange(event) {
    const nextCity = event.target.value
    setSelectedCity(nextCity)
    setQuery('')
    fetchWeather(normalizeCityName(nextCity))
  }

  function handleRefreshClick() {
    fetchWeather(normalizeCityName(locationLabel))
  }

  return (
    <header className="weather-header">
      <div className="weather-header__brand">
        <p className="weather-header__eyebrow">Weather App</p>
        <h1 className="weather-header__title">WeatherNow</h1>
        <p className="weather-header__subtitle">
          Get live conditions, hourly forecasts, and the latest weather alerts for your city.
        </p>
      </div>

      <section className="weather-header__search">
        <div className="weather-header__search-field">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="weather-header__input"
            placeholder="Search city name"
            aria-label="Search city"
          />
          <button className="weather-header__search-button" type="button" onClick={handleSearchClick}>
            Search
          </button>
        </div>

        <div className="weather-header__city-picker">
          {/* <label htmlFor="city-select" className="weather-header__label">
            Choose a city
          </label> */}
          {/* <select
            id="city-select"
            className="weather-header__select"
            value={selectedCity}
            onChange={handleCityChange}
          >
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select> */}
        </div>
      </section>

      <div className="weather-header__controls">
        <div className="weather-header__info">
          <span className="weather-header__label">Current location</span>
          <strong>{locationLabel}</strong>
        </div>

        <button className="weather-header__button" type="button" onClick={handleRefreshClick}>
          Refresh
        </button>
      </div>

      <section className="weather-header__details">
        {loading && <p className="weather-header__loading">Loading weather data…</p>}
        {error && <p className="weather-header__error">{error}</p>}
        {weather && !loading && !error && (
          <div className="weather-summary">
            <div className="weather-summary__top">
              <div>
                <span className="weather-summary__temp">{weather.temperature}°C</span>
                <p className="weather-summary__condition">{weather.description}</p>
              </div>
              <div className="weather-summary__meta">
                <p>Wind {weather.windspeed} km/h</p>
                <p>Direction {weather.winddirection}°</p>
              </div>
            </div>
            <p className="weather-summary__time">Observed at {new Date(weather.time).toLocaleString()}</p>
          </div>
        )}
      </section>
    </header>
  )
}

export default HeroSec
