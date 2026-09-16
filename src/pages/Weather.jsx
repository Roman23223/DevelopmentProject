import { useState, useEffect } from "react";
import { searchCity, getWeatherData } from "@api/OpenMeteo";
import { getWeatherInfo } from "@utils/openMeteo/weatherCodes";
import { useLocalStorage } from "@hooks/UseLocalStorage";
import DayCard from "@components/weather/DayCard";
import Styles from "@styles/Weather.module.css";

export default function Weather() {
  useEffect(() => {
    document.title = "Погода";
  }, []);

  // НАЧАЛО ИЛИ
  // Всегда 'current'
  // const [view, setView] = useState('current');
  // ИЛИ
  // Режим просмотра из localStorage через хук
  const [view, setView] = useLocalStorage("weatherView", "current");
  // КОНЕЦ ИЛИ

  // Избранные города — массив объектов {id, name, country, latitude, longitude}
  const [favorites, setFavorites] = useLocalStorage("weatherFavorites", []);

  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Загрузка погоды при ЛЮБОЙ смене city
  useEffect(() => {
    if (!city) return;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getWeatherData(city.latitude, city.longitude);
        setWeather(data.current);
        setDays(data.days);
      } catch {
        setError("Ошибка сети. Проверь интернет и попробуй ещё раз.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [city]);

  // Поиск городов
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setCities([]);
    setWeather(null);
    setDays([]);

    try {
      const results = await searchCity(query.trim());

      if (results.length === 0) {
        setError("Город не найден. Попробуй другое название.");
        return;
      }

      if (results.length === 1) {
        setCity(results[0]);
      } else {
        setCities(results);
      }
    } catch {
      setError("Ошибка сети. Проверь интернет и попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  // Очистка списка кандидатов
  function handleClearCityPicker() {
    setCities([]);
    setQuery("");
  }

  // Выбор города из списка кандидатов
  function handleSelectCity(selected) {
    setCities([]);
    setQuery(selected.name);
    setCity(selected);
  }

  // Быстрый переход по избранному городу
  function handleSelectFavorite(fav) {
    setCity(fav);
    setQuery(fav.name);
  }

  // Добавить в избранное (с проверкой на дубликаты)
  function handleAddToFavorites() {
    if (!city) return;
    const isAlreadyFav = favorites.some((f) => f.id === city.id);
    if (isAlreadyFav) return;

    // Храним только нужные поля (без лишней воды от API)
    setFavorites([
      ...favorites,
      {
        id: city.id,
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
      },
    ]);
  }

  // Удалить из избранного
  function handleRemoveFavorite(id) {
    setFavorites(favorites.filter((f) => f.id !== id));
  }

  const info = weather ? getWeatherInfo(weather.weather_code) : null;
  const hasData = Boolean(weather && city && info);
  const isFavorite = city ? favorites.some((f) => f.id === city.id) : false;

  return (
    <div className={Styles.app}>
      <h1 className={Styles.title}>Погода</h1>

      {/* ИЗБРАННЫЕ ГОРОДА */}
      {favorites.length > 0 && (
        <div className={Styles.favorites}>
          <p className={Styles.favoritesTitle}>Избранные города:</p>
          <div className={Styles.favoritesList}>
            {favorites.map((fav) => (
              <div key={fav.id} className={Styles.favoriteChip}>
                <button
                  type="button"
                  className={Styles.favoriteChipButton}
                  onClick={() => handleSelectFavorite(fav)}
                >
                  ⭐ {fav.name}
                  {fav.country && (
                    <span className={Styles.favoriteCountry}>
                      {" "}
                      ({fav.country})
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className={Styles.favoriteRemoveButton}
                  onClick={() => handleRemoveFavorite(fav.id)}
                  aria-label={`Удалить ${fav.name} из избранного`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* СПИСОК КАНДИДАТОВ */}
      {cities.length > 0 && (
        <div className={Styles.cityPicker}>
          <div className={Styles.cityPickerHeader}>
            <p className={Styles.cityPickerTitle}>
              Найдено несколько городов — выбери нужный:
            </p>
            <button
              type="button"
              className={Styles.clearCityPickerButton}
              onClick={handleClearCityPicker}
            >
              Очистить
            </button>
          </div>
          <ul className={Styles.cityList}>
            {cities.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={Styles.cityButton}
                  onClick={() => handleSelectCity(c)}
                >
                  <span className={Styles.cityName}>{c.name}</span>
                  {c.admin1 && (
                    <span className={Styles.cityRegion}>, {c.admin1}</span>
                  )}
                  <span className={Styles.cityCountry}> — {c.country}</span>
                  <span className={Styles.cityPopulation}>
                    {" "}
                    · {(c.population ?? 0).toLocaleString("ru-RU")} чел.
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ + КНОПКА ИЗБРАННОГО */}
      {hasData && (
        <div className={Styles.viewControls}>
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
          <button
            type="button"
            className={
              isFavorite ? Styles.favoriteButtonActive : Styles.favoriteButton
            }
            onClick={handleAddToFavorites}
            disabled={isFavorite}
          >
            {isFavorite ? "★ В избранном" : "☆ В избранное"}
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
