import { Link, NavLink } from 'react-router-dom';
import Styles from '@styles/Navbar.module.css';

export default function Navbar() {

  return (
    <nav className={Styles.navbar}>
      <NavLink to="/" className={({ isActive }) => isActive ? Styles.navLinkActive : Styles.navLink}>Главная</NavLink>
      <NavLink to="/weather" className={({ isActive }) => isActive ? Styles.navLinkActive : Styles.navLink}>Погода</NavLink>
      <NavLink to="/warehouse" className={({ isActive }) => isActive ? Styles.navLinkActive : Styles.navLink}>Склад</NavLink>
    </nav>
  );
} 