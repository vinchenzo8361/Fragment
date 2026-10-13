import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, FileText, Scissors, Puzzle, Sparkles, ArrowRight } from 'lucide-react';
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
      desc: 'Uniform NxN matrix cuts with edge gradient alignment.',
      icon: <Grid size={20} />,
      enabled: true,
    },
    {
      id: 'straight-strip',
      title: 'Straight Shreds',
      desc: 'Vertical ribbon shredded documents and OCR text continuity.',
      icon: <FileText size={20} />,
      enabled: true,
    },
    {
      id: 'cross-cut',
      title: 'Cross-Cut Shreds',
      desc: '2D confetti particle matching & text line reconstruction.',
      icon: <Scissors size={20} />,
      enabled: true,
    },
    {
      id: 'traditional',
      title: 'Classic Jigsaw',
      desc: 'Organic contour analysis with interlock tab/blank detection.',
      icon: <Puzzle size={20} />,
      enabled: false,
      tag: 'Coming Soon',
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
      alert('Could not initialize project. Please verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page-container">
      <div className="setup-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', marginBottom: '0.5rem' }}>
          <Sparkles size={16} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            New Investigation
          </span>
        </div>
        <h2 className="setup-card-title">Configure Workspace</h2>
        <p className="setup-card-desc">
          Select your fragmentation style and parameters to initialize a reconstruction pipeline.
        </p>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-field">
            <label className="form-label">Workspace / Project Title</label>
            <input 
              type="text" 
              className="form-input"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="e.g. Document Fracture #412"
              autoFocus
            />
          </div>

          <div className="form-field">
            <label className="form-label">Reconstruction Type</label>
            <div className="puzzle-type-grid">
              {puzzleTypes.map((t) => (
                <div 
                  key={t.id}
                  className={`puzzle-type-card ${puzzleType === t.id ? 'selected' : ''} ${!t.enabled ? 'disabled' : ''}`}
                  onClick={() => t.enabled && setPuzzleType(t.id)}
                >
                  <div className="type-card-icon">
                    {t.icon}
                  </div>
                  <div>
                    <div className="type-card-name">{t.title}</div>
                    {t.tag && (
                      <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                        {t.tag}
                      </span>
                    )}
                  </div>
                  <div className="type-card-desc">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {puzzleType === 'square-tile' && (
            <div className="form-field">
              <label className="form-label">Initial Grid Partition</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Rows</span>
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
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Columns</span>
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

          <div style={{ marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '0.9rem' }}
            >
              <span>{loading ? 'Initializing Studio...' : 'Launch Workspace'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSetup;
