import { useEffect } from 'react';
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 (Not found)";
  }, []);

  return (
    <div>
      <h1>404</h1>

      <h2>Упс! Страница не найдена</h2>

      <p>Кажется, вы заблудились. Такой страницы не существует.</p>

      <Link to="/">Вернуться на главную</Link>
    </div>
  );
}
