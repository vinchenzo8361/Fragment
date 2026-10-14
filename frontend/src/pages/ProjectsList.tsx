import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image as ImageIcon, Grid, ArrowRight, Folder, Trash2 } from 'lucide-react';
import { getProjects, deleteProject } from '../api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = () => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`Are you sure you want to delete workspace "${name}"?`)) {
      await deleteProject(id);
      loadAll();
    }
  };

  const formatPuzzleType = (type: string) => {
    switch (type) {
      case 'square-tile': return 'Square-Tile Solver';
      case 'puzzle-creator': return 'Puzzle Creator';
      case 'straight-strip': return 'Straight Shred';
      case 'cross-cut': return 'Cross-Cut';
      case 'traditional': return 'Classic Jigsaw';
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
            <p>Upload a source image, scrambled photo, or camera picture with borders.</p>
          </div>
        </div>
        <div className="workflow-step-card">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Clean & Extract</h3>
            <p>Automatically strip tabletop and frame borders to extract pure pieces.</p>
          </div>
        </div>
        <div className="workflow-step-card">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Permutations & Solve</h3>
            <p>Score color gradients across all placements to output the clean image.</p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="section-header-bar">
        <h2 className="section-title">
          <Folder size={20} color="var(--gold-primary)" />
          <span>All Workspaces</span>
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {projects.length} {projects.length === 1 ? 'WORKSPACE' : 'WORKSPACES'}
        </span>
      </div>

      {loading ? (
        <div className="empty-state-box">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading project registry...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state-box">
          <div style={{ width: 48, height: 48, margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--gold-subtle-bg)', border: '1px solid var(--border-gold-subtle)', color: 'var(--gold-primary)' }}>
            <Folder size={24} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: '#14161a' }}>No Projects Created Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 440, margin: '0 auto 1.5rem' }}>
            Click below to start your first project and configure a reconstruction grid.
          </p>
          <Link to="/setup" className="btn btn-primary">
            <Plus size={16} />
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="gold-badge">{formatPuzzleType(p.puzzle_type)}</span>
                    <button 
                      onClick={(e) => handleDelete(e, p.id, p.name)}
                      title="Delete Workspace"
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: 'var(--text-muted)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="project-card-id">{p.id}</div>
                <div className="project-meta-row">
                  <div className="meta-item">
                    <ImageIcon size={15} color="var(--gold-primary)" />
                    <span>{p.images ? p.images.length : 0} Sources</span>
                  </div>
                  <div className="meta-item">
                    <Grid size={15} color="var(--gold-primary)" />
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
