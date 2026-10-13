import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, Folder, Plus, Info, User } from 'lucide-react';
import LandingHome from './pages/LandingHome';
import About from './pages/About';
import ProjectsList from './pages/ProjectsList';
import ProjectSetup from './pages/ProjectSetup';
import Workspace from './pages/Workspace';
import Login from './pages/Login';
import './App.css';

function NavigationBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Brand Icon: links back to Home */}
        <Link to="/" className="nav-logo-icon" title="Fragment Home">
          <Layers size={18} />
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}
          >
            <Info size={14} />
            About
          </Link>
          <Link 
            to="/projects" 
            className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`}
          >
            <Folder size={14} />
            Workspaces
          </Link>
          <Link 
            to="/setup" 
            className={`nav-item ${location.pathname === '/setup' ? 'active' : ''}`}
          >
            <Plus size={14} />
            New Project
          </Link>
        </div>
      </div>

      <div className="nav-right">
        {/* Top Right Login Link */}
        <Link 
          to="/login" 
          className={`nav-login-btn ${location.pathname === '/login' ? 'active' : ''}`}
        >
          <User size={14} />
          <span>Sign In</span>
        </Link>
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
            <Route path="/" element={<LandingHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/setup" element={<ProjectSetup />} />
            <Route path="/workspace/:id" element={<Workspace />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
