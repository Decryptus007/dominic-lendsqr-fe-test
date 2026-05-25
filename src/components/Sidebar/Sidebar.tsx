import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { logout } from '../../services/authService';
import './Sidebar.scss';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarLink {
  label: string;
  icon: string;
  path: string;
}

interface SidebarGroup {
  title: string;
  links: SidebarLink[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigationGroups: SidebarGroup[] = [
    {
      title: 'CUSTOMERS',
      links: [
        { label: 'Users', icon: 'fa-solid fa-users', path: '/users' },
        { label: 'Guarantors', icon: 'fa-solid fa-user-shield', path: '/guarantors' },
        { label: 'Loans', icon: 'fa-solid fa-money-bill-1-wave', path: '/loans' },
        { label: 'Decision Models', icon: 'fa-solid fa-handshake', path: '/decision-models' },
        { label: 'Savings', icon: 'fa-solid fa-piggy-bank', path: '/savings' },
        { label: 'Loan Requests', icon: 'fa-solid fa-hand-holding-dollar', path: '/loan-requests' },
        { label: 'Whitelist', icon: 'fa-solid fa-user-check', path: '/whitelist' },
        { label: 'Karma', icon: 'fa-solid fa-user-slash', path: '/karma' },
      ],
    },
    {
      title: 'BUSINESSES',
      links: [
        { label: 'Organization', icon: 'fa-solid fa-briefcase', path: '/organization' },
        { label: 'Loan Products', icon: 'fa-solid fa-hand-holding-dollar', path: '/loan-products' },
        { label: 'Savings Products', icon: 'fa-solid fa-landmark', path: '/savings-products' },
        { label: 'Fees and Charges', icon: 'fa-solid fa-coins', path: '/fees-charges' },
        { label: 'Transactions', icon: 'fa-solid fa-repeat', path: '/transactions' },
        { label: 'Services', icon: 'fa-solid fa-server', path: '/services' },
        { label: 'Service Account', icon: 'fa-solid fa-user-gear', path: '/service-account' },
        { label: 'Settlements', icon: 'fa-solid fa-file-invoice-dollar', path: '/settlements' },
        { label: 'Reports', icon: 'fa-solid fa-chart-line', path: '/reports' },
      ],
    },
    {
      title: 'SETTINGS',
      links: [
        { label: 'Preferences', icon: 'fa-solid fa-sliders', path: '/preferences' },
        { label: 'Fees and Pricing', icon: 'fa-solid fa-percent', path: '/fees-pricing' },
        { label: 'Audit Logs', icon: 'fa-solid fa-clipboard-list', path: '/audit-logs' },
        { label: 'Systems Messages', icon: 'fa-solid fa-envelope-open-text', path: '/systems-messages' },
      ],
    },
  ];

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
    onClose();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Switch Organization Dropdown Selector */}
        <div className="sidebar__org-select">
          <i className="fa-solid fa-briefcase sidebar__org-icon"></i>
          <span className="sidebar__org-name">Switch Organization</span>
          <i className="fa-solid fa-chevron-down sidebar__org-caret"></i>
        </div>

        {/* Dashboard Home Link */}
        <div className="sidebar__section">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar__link sidebar__link--dashboard ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={onClose}
          >
            <i className="fa-solid fa-house"></i>
            <span>Dashboard</span>
          </NavLink>
        </div>

        {/* Navigation Groups */}
        {navigationGroups.map((group) => (
          <div className="sidebar__group" key={group.title}>
            <h3 className="sidebar__group-title">{group.title}</h3>
            <ul className="sidebar__group-list">
              {group.links.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                    }
                    onClick={onClose}
                  >
                    <i className={link.icon}></i>
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <hr className="sidebar__divider" />

        {/* Footer Links */}
        <div className="sidebar__footer">
          <button className="sidebar__link sidebar__link--logout" onClick={handleLogoutClick}>
            <i className="fa-solid fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
          <div className="sidebar__version">v1.0.0</div>
        </div>
      </aside>

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

export default Sidebar;
