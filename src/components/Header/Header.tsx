import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.scss';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__left">
        {/* Mobile menu toggle */}
        <button 
          className="header__menu-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Lendsqr Logo */}
        <div className="header__logo" onClick={() => navigate('/users')}>
          <img src="/auth/logo.svg" alt="Lendsqr Logo" />
        </div>
      </div>

      <div className="header__center">
        {/* Search Input */}
        <div className="header__search">
          <input
            type="text"
            className="header__search-input"
            placeholder="Search for anything"
          />
          <button className="header__search-btn" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      <div className="header__right">
        {/* Docs Link */}
        <a href="#" className="header__docs-link">
          Docs
        </a>

        {/* Notification Bell */}
        <button className="header__btn" aria-label="Notifications">
          <i className="fa-regular fa-bell"></i>
        </button>

        {/* User Info Dropdown */}
        <div className="header__profile">
          <img
            src="/avatar-fallback.png"
            alt="Adedeji"
            className="header__profile-avatar"
          />
          <span className="header__profile-name">Adedeji</span>
          <i className="fa-solid fa-caret-down header__profile-caret"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
