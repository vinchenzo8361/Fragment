import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layers, Plus, Compass } from 'lucide-react';
import Home from './pages/Home';
import ProjectSetup from './pages/ProjectSetup';
import Workspace from './pages/Workspace';
import './App.css';

function NavigationBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Sleek Logo Icon without text as requested */}
        <Link to="/" className="nav-logo-icon" title="Home">
          <Layers size={20} />
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Compass size={15} />
            Projects
          </Link>
          <Link 
            to="/setup" 
            className={`nav-item ${location.pathname === '/setup' ? 'active' : ''}`}
          >
            <Plus size={15} />
            New Workspace
          </Link>
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-status-pill">
          <span className="pulse-dot"></span>
          <span>ENGINE READY</span>
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
        <main className="main-content">
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
