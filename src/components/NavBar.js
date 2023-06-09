import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.js';
import './styles/NavBar.css';


function NavBar({ onSignOut }) {
  return (
    <div className="navbar">
      <div className="navbar__logo">
        <Logo/>
      </div>
      <ul className="navbar__nav">
        <li><Link to="ducks" className="navbar__link">Утки</Link></li>
        <li><Link to="my-profile" className="navbar__link">Мой профиль</Link></li>
        <li><button onClick={onSignOut} className="navbar__link navbar__button">Выйти</button></li>
      </ul>
    </div>
  )
}

export default NavBar;