import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image as ImageIcon, Grid, ArrowRight, Folder } from 'lucide-react';
import { getProjects } from '../api';

const ProjectsList = () => {
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
      {/* Executive Header */}
      <div className="action-banner">
        <div className="action-banner-text">
          <h1>Reconstruction Workspaces</h1>
          <p>
            Browse, manage, or launch image solving sessions. Select any workspace to enter the interactive workbench.
          </p>
        </div>
        <Link to="/setup" className="btn btn-primary" style={{ flexShrink: 0 }}>
          <Plus size={16} />
          <span>New Project</span>
        </Link>
      </div>

      {/* Crystal Clear 3-Step Process Strip */}
      <div className="workflow-steps-strip">
        <div className="workflow-step-card">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Upload Media</h3>
            <p>Upload a source image or shredded strips into your workspace.</p>
          </div>
        </div>
        <div className="workflow-step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Split & Extract</h3>
            <p>Partition the image into indexed pieces or detect physical fragments.</p>
          </div>
        </div>
        <div className="workflow-step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Solve & Reconstruct</h3>
            <p>Run boundary matching and greedy optimization to solve the layout.</p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="section-header-bar">
        <h2 className="section-title">
          <Folder size={18} color="var(--gold-pure)" />
          <span>All Workspaces</span>
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          {projects.length} {projects.length === 1 ? 'WORKSPACE' : 'WORKSPACES'}
        </span>
      </div>

      {loading ? (
        <div className="empty-state-box">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading project registry...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state-box">
          <div style={{ width: 44, height: 44, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'var(--surface-navy)', color: 'var(--gold-pure)' }}>
            <Folder size={20} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#fff' }}>No Projects Created Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 440, margin: '0 auto 1.5rem' }}>
            Click below to start your first project and configure a reconstruction grid.
          </p>
          <Link to="/setup" className="btn btn-primary">
            <Plus size={15} />
            <span>Create First Project</span>
          </Link>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((p: any) => (
            <div key={p.id} className="project-card">
              <div>
                <div className="project-card-header">
                  <h3 className="project-card-title">{p.name}</h3>
                  <span className="gold-badge">{formatPuzzleType(p.puzzle_type)}</span>
                </div>
                <div className="project-card-id">{p.id}</div>
                <div className="project-meta-row">
                  <div className="meta-item">
                    <ImageIcon size={14} />
                    <span>{p.images ? p.images.length : 0} Sources</span>
                  </div>
                  <div className="meta-item">
                    <Grid size={14} />
                    <span>{p.grid_rows && p.grid_cols ? `${p.grid_rows}×${p.grid_cols} Grid` : 'Dynamic'}</span>
                  </div>
                </div>
              </div>
              <Link to={`/workspace/${p.id}`} className="btn btn-navy" style={{ width: '100%' }}>
                <span>Open Project Workspace</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
