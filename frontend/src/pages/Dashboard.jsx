import './Dashboard.css';
import toggle from '../assets/night-mode.png'
import { FaChevronDown, FaSearch } from 'react-icons/fa';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <button className="new-folder-btn">+ New Folder</button>

        <hr/>
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
          <img className='dark' src={toggle} alt='light dark toggle icon'/>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search in 'New Folder'" />
          </div>
          <div className="profile-photo" />
        </header>

        <section className="empty-state">
          <h1 id='placeholder-text'>Create New Folder</h1>
          <h1 id='placeholder-text'>to Start</h1>
          <i class="fi fi-tr-folder-open"></i>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
