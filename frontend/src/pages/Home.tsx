import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image as ImageIcon, Grid, ArrowRight, Sparkles, FolderKanban } from 'lucide-react';
import { getProjects } from '../api';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPuzzleType = (type: string) => {
    switch (type) {
      case 'square-tile': return 'Square Grid';
      case 'straight-strip': return 'Shredded Strips';
      case 'cross-cut': return 'Cross-Cut';
      case 'traditional': return 'Jigsaw';
      default: return type;
    }
  };

  return (
    <div className="home-container">
      {/* High-tech Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Forensic Reconstruction Platform</span>
        </div>
        <h1 className="hero-title">
          Reconstruct Fractured Realities.
        </h1>
        <p className="hero-subtitle">
          Classical boundary optimization, computer vision gradients, and local machine learning to solve shredded documents and scattered image puzzles.
        </p>
        <div>
          <Link to="/setup" className="btn btn-primary">
            <Plus size={16} />
            Initialize New Workspace
          </Link>
        </div>
      </section>

      {/* Projects List Section */}
      <div className="projects-header-row">
        <h2 className="section-heading">
          <FolderKanban size={20} color="#818cf8" />
          Active Workspaces
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          {projects.length} {projects.length === 1 ? 'WORKSPACE' : 'WORKSPACES'}
        </span>
      </div>

      {loading ? (
        <div className="empty-projects-state">
          <p style={{ color: 'var(--text-dim)' }}>Connecting to engine...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-projects-state">
          <div className="empty-icon-wrap">
            <Grid size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
            No Workspaces Initialized
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Start by creating a workspace for square-tile image solving or shredded paper reconstruction.
          </p>
          <Link to="/setup" className="btn btn-secondary">
            <Plus size={16} />
            Create Your First Workspace
          </Link>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((p: any) => (
            <div key={p.id} className="project-card">
              <div>
                <div className="project-card-top">
                  <h3 className="project-card-title">{p.name}</h3>
                  <span className="project-type-tag">
                    {formatPuzzleType(p.puzzle_type)}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  ID: {p.id}
                </div>
                <div className="project-meta-row">
                  <div className="project-meta-item">
                    <ImageIcon size={14} />
                    <span>{p.images ? p.images.length : 0} Sources</span>
                  </div>
                  <div className="project-meta-item">
                    <Grid size={14} />
                    <span>{p.grid_rows && p.grid_cols ? `${p.grid_rows}×${p.grid_cols}` : 'Auto Grid'}</span>
                  </div>
                </div>
              </div>

              <Link to={`/workspace/${p.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                <span>Launch Studio</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
