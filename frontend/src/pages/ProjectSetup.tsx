import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, FileText, Scissors, Puzzle, Wand2, Check } from 'lucide-react';
import { createProject } from '../api';

const ProjectSetup = () => {
  const [name, setName] = useState('');
  const [puzzleType, setPuzzleType] = useState('square-tile');
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Exactly 5 distinct modes:
  const puzzleTypes = [
    {
      id: 'square-tile',
      title: 'Square-Tile Solver',
      desc: 'Reconstruct shuffled grid puzzles (e.g. 2x2, 4x4) by testing permutations & edge gradients.',
      icon: <Grid size={18} />,
      enabled: true,
    },
    {
      id: 'puzzle-creator',
      title: 'Puzzle Creator (Generator)',
      desc: 'Turn any normal image into a real playable puzzle with custom tile sliders up to 20x20.',
      icon: <Wand2 size={18} />,
      enabled: true,
    },
    {
      id: 'straight-strip',
      title: 'Straight Shredded Paper',
      desc: 'Reconstruct documents run through strip shredders by matching vertical edges & text strokes.',
      icon: <FileText size={18} />,
      enabled: true,
    },
    {
      id: 'cross-cut',
      title: 'Cross-Cut Shredded Paper',
      desc: '2D confetti rectangular shred alignment, text continuation, and spatial constraint solving.',
      icon: <Scissors size={18} />,
      enabled: true,
    },
    {
      id: 'traditional',
      title: 'Classic Jigsaw Solver',
      desc: 'Contour curve detection, tab and blank matching, and outer border identification.',
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
        grid_rows: (puzzleType === 'square-tile' || puzzleType === 'puzzle-creator') ? Number(rows) : undefined,
        grid_cols: (puzzleType === 'square-tile' || puzzleType === 'puzzle-creator') ? Number(cols) : undefined,
      });
      navigate(`/workspace/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert('Could not initialize project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <h2 className="setup-title">Create New Project</h2>
        <p className="setup-description">
          Choose a project name and select your mode. You can adjust parameters anytime inside the studio.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">1. Project Name</label>
            <input 
              type="text" 
              className="form-input"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="e.g. Scrambled Honda Civic 2x2"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">2. Select Mode (5 Supported Modes)</label>
            <div className="type-options-list">
              {puzzleTypes.map((t) => (
                <div 
                  key={t.id}
                  className={`type-option-item ${puzzleType === t.id ? 'selected' : ''} ${!t.enabled ? 'disabled' : ''}`}
                  onClick={() => t.enabled && setPuzzleType(t.id)}
                >
                  <div className="type-option-main">
                    <div style={{ color: puzzleType === t.id ? 'var(--gold-primary)' : 'var(--text-secondary)' }}>
                      {t.icon}
                    </div>
                    <div>
                      <div className="type-option-name">{t.title}</div>
                      <div className="type-option-desc">{t.desc}</div>
                    </div>
                  </div>
                  {puzzleType === t.id && (
                    <div style={{ color: 'var(--gold-primary)' }}>
                      <Check size={16} />
                    </div>
                  )}
                  {!t.enabled && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      Later Stage
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {(puzzleType === 'square-tile' || puzzleType === 'puzzle-creator') && (
            <div className="form-group">
              <label className="form-label">3. Initial Grid Partition</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/projects')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create & Enter Studio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSetup;
