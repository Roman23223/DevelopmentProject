import { getWeatherInfo } from '@utils/openMeteo/weatherCodes';
import { formatDay, isToday } from '@utils/openMeteo/date';
import Styles from '@styles/weather/DayCard.module.css';

export default function DayCard({ day, index = 0 }) {
  const info = getWeatherInfo(day.code);

  return (
    <div
      className={Styles.dayCard}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={Styles.dayDate}>
        {isToday(day.date) ? 'Сегодня' : formatDay(day.date)}
      </div>
      <div className={Styles.dayIcon} title={info.label}>
        {info.icon}
      </div>
      <div className={Styles.dayTemps}>
        <span className={Styles.tempMax}>{Math.round(day.max)}°</span>
        <span className={Styles.tempMin}>{Math.round(day.min)}°</span>
      </div>
    </div>
  );
}