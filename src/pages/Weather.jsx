import { useState, useEffect } from "react";
import { searchCity, getWeatherData } from "@api/openMeteo";
import { getWeatherInfo } from "@utils/openMeteo/weatherCodes";
import DayCard from "@components/weather/DayCard";
import Styles from "@styles/Weather.module.css";

export default function Weather() {
  useEffect(() => {
    document.title = "Погода";
  }, []);

  const [query, setQuery] = useState("");
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // НАЧАЛО
  // ИЛИ Всегда начальный вид 'current'
  //const [view, setView] = useState('current'); 
  // ИЛИ Брать и сохранять из localStorage
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem("weatherView");
    // Проверяем, что там лежит допустимое значение, а не мусор
    return saved === "week" || saved === "current" ? saved : "current";
  });
  useEffect(() => {
    localStorage.setItem('weatherView', view);
  }, [view]);
  // КОНЕЦ

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setDays([]);
    //setView('current'); // Сбрасывать вид при запуске поиска

    try {
      const cities = await searchCity(query.trim());
      if (cities.length === 0) {
        setError("Город не найден. Попробуй другое название.");
        return;
      }
      const first = cities[0];
      setCity(first);

      const data = await getWeatherData(first.latitude, first.longitude);
      setWeather(data.current);
      setDays(data.days);
    } catch {
      setError("Ошибка сети. Проверь интернет и попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  const info = weather ? getWeatherInfo(weather.weather_code) : null;
  const hasData = Boolean(weather && city && info);

  return (
    <div className={Styles.app}>
      <h1 className={Styles.title}>Погода</h1>

      <form className={Styles.searchForm} onSubmit={handleSearch}>
        <input
          className={Styles.searchInput}
          type="text"
          placeholder="Введи город, например: Москва"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={Styles.searchButton}
          type="submit"
          disabled={loading}
        >
          Найти
        </button>
      </form>

      {loading && <p className={Styles.loading}>Загружаю данные…</p>}

      {error && <p className={Styles.error}>{error}</p>}

      {/* ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ */}
      {hasData && (
        <div className={Styles.viewToggle}>
          <button
            type="button"
            className={
              view === "current" ? Styles.viewButtonActive : Styles.viewButton
            }
            onClick={() => setView("current")}
          >
            Сегодня
          </button>
          <button
            type="button"
            className={
              view === "week" ? Styles.viewButtonActive : Styles.viewButton
            }
            onClick={() => setView("week")}
          >
            7 дней
          </button>
        </div>
      )}

      {/* РЕЖИМ 1: текущая погода */}
      {hasData && view === "current" && (
        <div className={Styles.card}>
          <h2 className={Styles.cardCity}>{city.name}</h2>
          <div className={Styles.cardIcon}>{info.icon}</div>
          <div className={Styles.cardTemp}>
            {Math.round(weather.temperature_2m)}°C
          </div>
          <p className={Styles.cardDesc}>{info.label}</p>

          <div className={Styles.cardDetails}>
            <div className={Styles.detail}>
              <div className={Styles.detailLabel}>Ощущается</div>
              <div className={Styles.detailValue}>
                {Math.round(weather.apparent_temperature)}°C
              </div>
            </div>
            <div className={Styles.detail}>
              <div className={Styles.detailLabel}>Влажность</div>
              <div className={Styles.detailValue}>
                {weather.relative_humidity_2m}%
              </div>
            </div>
            <div className={Styles.detail}>
              <div className={Styles.detailLabel}>Ветер</div>
              <div className={Styles.detailValue}>
                {Math.round(weather.wind_speed_10m)} км/ч
              </div>
            </div>
          </div>
        </div>
      )}

      {/* РЕЖИМ 2: прогноз на 7 дней */}
      {hasData && view === "week" && days.length > 0 && (
        <section className={Styles.forecast}>
          <h2 className={Styles.forecastTitle}>Прогноз на 7 дней</h2>
          <div className={Styles.forecastGrid}>
            {days.map((day) => (
              <DayCard key={day.date} day={day} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
