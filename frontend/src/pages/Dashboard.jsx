import React from 'react';
import './Dashboard.css';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <button className="new-folder-btn">+ New Folder</button>

        <nav className="folder-nav">
          <div className="section-title">My Folders <FaChevronDown className="chevron" /></div>
          <div className="folder-item active">
            New Folder <FaChevronDown className="chevron" />
          </div>

          <div className="other-items">
            <p>Saved PDFs (?)</p>
            <p>Trash</p>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search in 'New Folder'" />
          </div>
          <div className="profile-photo" />
        </header>

        <section className="empty-state">
          <h1>Create New Folder to Start</h1>
          <div className="folder-icon" />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
