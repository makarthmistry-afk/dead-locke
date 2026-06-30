# 🌤️ Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from public APIs and displays it in an intuitive interface.

## ✨ Features

### Core Functionality
- **Real-time Weather Data**: Fetch current weather conditions from OpenWeatherMap API
- **Search by Location**: Search weather for any city worldwide
- **Current Weather Display**: Temperature, humidity, wind speed, pressure, visibility
- **5-Day Forecast**: Extended weather forecast with daily predictions
- **Weather Alerts**: Warnings for extreme weather conditions
- **Multiple Units**: Support for Celsius, Fahrenheit, and Kelvin
- **Geolocation**: Auto-detect user location using browser geolocation

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light themes
- **Weather Icons**: Dynamic weather icons based on conditions
- **Hourly Forecast**: Detailed hourly weather data
- **Weather Maps**: Interactive weather visualization
- **Favorite Locations**: Save and manage favorite cities
- **Recent Searches**: Quick access to previously searched locations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

### Installation

```bash
# Clone or navigate to the weather dashboard directory
cd weather-dashboard

# Install dependencies
npm install
```

### Configuration

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env` file in the root directory:

```env
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
REACT_APP_API_BASE_URL=https://api.openweathermap.org/data/2.5
```

### Running the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
weather-dashboard/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── SearchBar.js          # Search functionality
│   │   ├── CurrentWeather.js     # Current weather display
│   │   ├── Forecast.js           # 5-day forecast
│   │   ├── HourlyForecast.js     # Hourly breakdown
│   │   ├── WeatherAlerts.js      # Weather warnings
│   │   ├── FavoritesList.js      # Saved locations
│   │   ├── ThemeToggle.js        # Dark/Light theme
│   │   └── WeatherDetails.js     # Additional details
│   ├── services/
│   │   └── weatherApi.js         # API integration
│   ├── hooks/
│   │   ├── useWeather.js         # Weather data hook
│   │   ├── useGeolocation.js     # Location hook
│   │   └── useLocalStorage.js    # Persistent storage
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## 🔌 API Integration

### OpenWeatherMap API Endpoints Used

1. **Current Weather**
   ```
   GET /weather?q={city}&appid={API_KEY}&units={metric/imperial}
   ```

2. **5-Day Forecast**
   ```
   GET /forecast?q={city}&appid={API_KEY}&units={metric/imperial}
   ```

3. **Geolocation**
   ```
   GET /weather?lat={lat}&lon={lon}&appid={API_KEY}&units={metric/imperial}
   ```

4. **Air Quality**
   ```
   GET /air_pollution?lat={lat}&lon={lon}&appid={API_KEY}
   ```

## 📊 Data Structure

### Current Weather Object
```javascript
{
  city: "London",
  country: "GB",
  temperature: 15,
  feelsLike: 14,
  description: "Partly Cloudy",
  icon: "02d",
  humidity: 65,
  pressure: 1013,
  visibility: 10000,
  windSpeed: 5.5,
  windDegree: 240,
  clouds: 40,
  sunrise: 1625097600,
  sunset: 1625154000
}
```

### Forecast Object
```javascript
{
  date: "2024-07-01",
  tempMax: 20,
  tempMin: 12,
  description: "Rainy",
  icon: "10d",
  humidity: 80,
  windSpeed: 8,
  rainfall: 5.5
}
```

## 🎨 Features in Detail

### 1. Search Functionality
- Autocomplete suggestions
- Recent searches history
- Clear search button
- Enter to search

### 2. Current Weather Display
- Large temperature display
- Weather condition with icon
- "Feels like" temperature
- Humidity percentage
- Wind speed and direction
- Pressure reading
- Visibility distance
- UV index
- Sunrise and sunset times

### 3. 5-Day Forecast
- Daily high/low temperatures
- Weather condition icons
- Precipitation chance
- Wind information
- Clickable for detailed view

### 4. Hourly Forecast
- 24-hour breakdown
- Scrollable carousel
- Temperature and conditions
- Precipitation probability

### 5. Weather Alerts
- Severe weather warnings
- Color-coded severity levels
- Actionable information
- Dismissible alerts

### 6. Favorites System
- Save favorite locations
- Quick access buttons
- Remove favorites
- Persistent storage

## 🎨 Color Scheme & Themes

### Light Theme
- Background: #ffffff
- Text: #333333
- Cards: #f5f5f5
- Accent: #ff6b6b

### Dark Theme
- Background: #1a1a1a
- Text: #ffffff
- Cards: #2d2d2d
- Accent: #ff8787

## 📱 Responsive Design

- **Mobile** (320px - 768px): Single column, optimized touch
- **Tablet** (768px - 1024px): Two columns, larger cards
- **Desktop** (1024px+): Multi-column layout, detailed sidebar

## 🔒 Security

- API keys stored in environment variables
- HTTPS only API calls
- Rate limiting implementation
- Error handling for API failures
- User data stored locally (no server storage)

## ⚡ Performance

- React lazy loading for components
- API call caching (5 minutes)
- Image optimization
- Debounced search input
- Code splitting

## 🐛 Troubleshooting

### API Key Issues
- Verify API key in .env file
- Check API key is activated on OpenWeatherMap
- Ensure key has correct permissions

### Location Not Detected
- Enable location permission in browser
- Check browser privacy settings
- Verify HTTPS connection

### Data Not Updating
- Check internet connection
- Verify API service status
- Clear browser cache
- Check API rate limits

## 🚀 Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

### GitHub Pages
```bash
npm run build
npm install gh-pages --save-dev
```

## 🔄 Future Enhancements

- [ ] Weather radar integration
- [ ] Air quality index display
- [ ] Pollen count information
- [ ] Historical weather data
- [ ] Weather comparison tool
- [ ] Precipitation maps
- [ ] Multi-day alerts
- [ ] Weather notifications
- [ ] PWA support
- [ ] Offline functionality

## 📚 API Documentation

- [OpenWeatherMap API](https://openweathermap.org/api)
- [Weather Icons](https://openweathermap.org/weather-conditions)
- [API Response Format](https://openweathermap.org/current)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use in your projects

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- React community
- Weather icons by OpenWeatherMap

---

**Made with ☀️ for weather enthusiasts**
