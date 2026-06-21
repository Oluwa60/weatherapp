import './App.css'

function Footer() {
  return (
    <footer className="weather-footer">
      <div className="weather-footer__content">
        <p className="weather-footer__text">
          WeatherNow delivers real-time forecasts, alerts, and travel-ready conditions for cities around the world.
        </p>
        <ul className="weather-footer__links">
          <li><a href="#" className="weather-footer__link">Home</a></li>
          <li><a href="#" className="weather-footer__link">Cities</a></li>
          <li><a href="#" className="weather-footer__link">Forecast</a></li>
          <li><a href="#" className="weather-footer__link">Contact</a></li>
        </ul>
      </div>
      <p className="weather-footer__note">© 2026 WeatherNow. Built for simple, clean weather updates.</p>
    </footer>
  )
}

export default Footer
