import { useEffect } from 'react';
import Styles from '@styles/Home.module.css'

export default function NotFound() {
  useEffect(() => {
    document.title = "Главная";
  }, []);

  return (
    <div className={Styles.mainContainer}>
        <h1>Это главная страница</h1>
    </div>
  );
}
