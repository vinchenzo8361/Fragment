import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, Folder, Plus } from 'lucide-react';
import Home from './pages/Home';
import ProjectSetup from './pages/ProjectSetup';
import Workspace from './pages/Workspace';
import './App.css';

function NavigationBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Clean gold-bordered icon, NO text */}
        <Link to="/" className="nav-logo-icon" title="Workspaces">
          <Layers size={18} />
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Folder size={15} />
            <span>Workspaces</span>
          </Link>
          <Link 
            to="/setup" 
            className={`nav-item ${location.pathname === '/setup' ? 'active' : ''}`}
          >
            <Plus size={15} />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-status-pill">
          <div className="gold-dot"></div>
          <span>LOCAL ENGINE</span>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavigationBar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<ProjectSetup />} />
            <Route path="/workspace/:id" element={<Workspace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
