import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { logout } from '../../services/authService';
import './Header.scss';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
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

          {/* Profile Dropdown */}
          <div className="header__profile" ref={profileRef}>
            <button
              className="header__profile-trigger"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-label="Open user menu"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              <img
                src="/avatar-fallback.png"
                alt="Adedeji"
                className="header__profile-avatar"
              />
              <span className="header__profile-name">Adedeji</span>
              <i className={`fa-solid fa-caret-${isProfileOpen ? 'up' : 'down'} header__profile-caret`}></i>
            </button>

            {isProfileOpen && (
              <div className="header__profile-dropdown" role="menu">
                <button
                  className="header__profile-dropdown-item header__profile-dropdown-item--logout"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Logout"
        message="Are you sure you want to log out of your account?"
        confirmText="Yes, Logout"
        cancelText="Stay Logged In"
        type="danger"
        onConfirm={handleLogoutConfirm}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

export default Header;
