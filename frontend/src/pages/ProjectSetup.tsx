import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, FileText, Scissors, Puzzle } from 'lucide-react';
import { createProject } from '../api';

const ProjectSetup = () => {
  const [name, setName] = useState('');
  const [puzzleType, setPuzzleType] = useState('square-tile');
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const puzzleTypes = [
    {
      id: 'square-tile',
      title: 'Square-Tile Grid',
      desc: 'Uniform row × column image matrix with boundary gradient solving.',
      icon: <Grid size={18} />,
      enabled: true,
    },
    {
      id: 'straight-strip',
      title: 'Straight Shredded Paper',
      desc: 'Vertical ribbon shredded documents and OCR text continuity.',
      icon: <FileText size={18} />,
      enabled: true,
    },
    {
      id: 'cross-cut',
      title: 'Cross-Cut Shredded Paper',
      desc: '2D rectangular particle reconstruction and alignment.',
      icon: <Scissors size={18} />,
      enabled: true,
    },
    {
      id: 'traditional',
      title: 'Classic Jigsaw',
      desc: 'Curved interlocking contour and tab/blank analysis.',
      icon: <Puzzle size={18} />,
      enabled: false,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await createProject({ 
        name, 
        puzzle_type: puzzleType,
        grid_rows: puzzleType === 'square-tile' ? Number(rows) : undefined,
        grid_cols: puzzleType === 'square-tile' ? Number(cols) : undefined,
      });
      navigate(`/workspace/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert('Could not initialize project. Verify that the local backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h2 className="setup-title">New Project</h2>
        <p className="setup-description">
          Set up a new reconstruction project and specify the fragmentation type.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input 
              type="text" 
              className="form-input"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="e.g. Test Pattern 01"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reconstruction Type</label>
            <div className="type-options-list">
              {puzzleTypes.map((t) => (
                <div 
                  key={t.id}
                  className={`type-option-item ${puzzleType === t.id ? 'selected' : ''} ${!t.enabled ? 'disabled' : ''}`}
                  onClick={() => t.enabled && setPuzzleType(t.id)}
                >
                  <div className="type-option-main">
                    <div style={{ color: puzzleType === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {t.icon}
                    </div>
                    <div>
                      <div className="type-option-name">{t.title}</div>
                      <div className="type-option-desc">{t.desc}</div>
                    </div>
                  </div>
                  {!t.enabled && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      Planned
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {puzzleType === 'square-tile' && (
            <div className="form-group">
              <label className="form-label">Grid Partition</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rows</span>
                  <input 
                    type="number" 
                    min={2} 
                    max={20}
                    value={rows} 
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="form-input" 
                    style={{ marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Columns</span>
                  <input 
                    type="number" 
                    min={2} 
                    max={20}
                    value={cols} 
                    onChange={(e) => setCols(Number(e.target.value))}
                    className="form-input" 
                    style={{ marginTop: '0.25rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSetup;
