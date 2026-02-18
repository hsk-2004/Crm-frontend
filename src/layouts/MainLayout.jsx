import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import './MainLayout.css';

export function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="layout-container">
        <Sidebar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
