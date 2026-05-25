import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DashboardLayout.scss';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Top Header */}
      <Header onToggleSidebar={handleToggleSidebar} />

      {/* Left Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content Area */}
      <main className="dashboard-layout__main">
        <div className="dashboard-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
