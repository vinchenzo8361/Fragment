import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProjectSetup from './pages/ProjectSetup';
import Workspace from './pages/Workspace';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">Image Solver</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/setup">New Project</Link>
          </div>
        </nav>
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
