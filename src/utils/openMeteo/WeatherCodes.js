const WEATHER_CODES = {
  0:  { label: 'Ясно', icon: '☀️' },
  1:  { label: 'Преимущественно ясно', icon: '🌤️' },
  2:  { label: 'Переменная облачность', icon: '⛅' },
  3:  { label: 'Пасмурно', icon: '☁️' },
  45: { label: 'Туман', icon: '🌫️' },
  48: { label: 'Изморозь', icon: '🌫️' },
  51: { label: 'Слабая морось', icon: '🌦️' },
  53: { label: 'Морось', icon: '🌦️' },
  55: { label: 'Сильная морось', icon: '🌧️' },
  61: { label: 'Небольшой дождь', icon: '🌦️' },
  63: { label: 'Дождь', icon: '🌧️' },
  65: { label: 'Сильный дождь', icon: '🌧️' },
  71: { label: 'Небольшой снег', icon: '🌨️' },
  73: { label: 'Снег', icon: '❄️' },
  75: { label: 'Сильный снег', icon: '❄️' },
  80: { label: 'Ливень', icon: '🌧️' },
  81: { label: 'Сильный ливень', icon: '🌧️' },
  82: { label: 'Очень сильный ливень', icon: '⛈️' },
  95: { label: 'Гроза', icon: '⛈️' },
  96: { label: 'Гроза с градом', icon: '⛈️' },
  99: { label: 'Сильная гроза с градом', icon: '⛈️' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] ?? { label: 'Неизвестно', icon: '❓' };
}