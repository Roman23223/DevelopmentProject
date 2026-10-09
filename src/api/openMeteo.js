const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Поиск города по названию → массив совпадений
export async function searchCity(name) {
  const res = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(name)}&count=5&language=ru&format=json`
  );
  if (!res.ok) throw new Error('Сервис поиска городов недоступен');
  const data = await res.json();
  return data.results ?? [];
}

// Текущая погода + прогноз на 7 дней
export async function getWeatherData(lat, lon, signal) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '7',
  });

  // Запрос прерывается либо нами (смена города), либо по таймауту в 10 секунд
  const timeout = AbortSignal.timeout(10000);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const res = await fetch(`${FORECAST_URL}?${params}`, { signal: combined });

  if (!res.ok) throw new Error('Сервис погоды недоступен');
  const data = await res.json();

  // Собираем «колонки» в массив объектов-дней
  const days = data.daily.time.map((date, i) => ({
    date,
    code: data.daily.weather_code[i],
    max: data.daily.temperature_2m_max[i],
    min: data.daily.temperature_2m_min[i],
  }));

  return { current: data.current, days };
}