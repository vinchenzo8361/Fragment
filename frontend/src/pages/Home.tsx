import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image as ImageIcon, Grid, ArrowRight, Folder } from 'lucide-react';
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
      case 'straight-strip': return 'Straight Shred';
      case 'cross-cut': return 'Cross-Cut';
      case 'traditional': return 'Jigsaw';
      default: return type;
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <div>
          <h1 className="home-title">Projects</h1>
          <p className="home-subtitle">Manage image puzzle reconstruction sessions and shredded document runs.</p>
        </div>
        <Link to="/setup" className="btn btn-primary">
          <Plus size={15} />
          <span>New Project</span>
        </Link>
      </div>

      {loading ? (
        <div className="empty-state">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Folder size={22} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>No projects found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Create a project to begin reconstructing images from tiles or strips.
          </p>
          <Link to="/setup" className="btn btn-primary">
            <Plus size={15} />
            <span>Create Project</span>
          </Link>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((p: any) => (
            <div key={p.id} className="project-card">
              <div>
                <div className="project-card-header">
                  <h3 className="project-card-title">{p.name}</h3>
                  <span className="badge-tag">{formatPuzzleType(p.puzzle_type)}</span>
                </div>
                <div className="project-card-id">{p.id}</div>
                <div className="project-meta-row">
                  <div className="meta-item">
                    <ImageIcon size={14} />
                    <span>{p.images ? p.images.length : 0} Sources</span>
                  </div>
                  <div className="meta-item">
                    <Grid size={14} />
                    <span>{p.grid_rows && p.grid_cols ? `${p.grid_rows}×${p.grid_cols}` : 'Grid'}</span>
                  </div>
                </div>
              </div>
              <Link to={`/workspace/${p.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                <span>Open Project</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
