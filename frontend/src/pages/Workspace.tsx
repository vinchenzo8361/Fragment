import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Upload, 
  ArrowLeft, 
  Layers, 
  Grid, 
  Play, 
  Sliders,
  HelpCircle,
  FileImage
} from 'lucide-react';
import { getProject, uploadImage } from '../api';

const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const fetchProject = () => {
    if (id) {
      getProject(id)
        .then(res => setProject(res.data))
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && id) {
      setUploading(true);
      try {
        await uploadImage(id, e.target.files[0]);
        fetchProject();
      } catch (err) {
        console.error(err);
        alert('Image upload failed. Ensure the local backend is running.');
      } finally {
        setUploading(false);
      }
    }
  };

  if (!project) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Loading project workspace...
      </div>
    );
  }

  return (
    <div className="workspace-wrapper">
      {/* Top Application Bar */}
      <div className="workspace-toolbar">
        <div className="workspace-identity">
          <Link to="/" className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} title="Back to Projects">
            <ArrowLeft size={14} />
          </Link>
          <span className="workspace-title">{project.name}</span>
          <span className="gold-badge">
            {project.puzzle_type.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {project.id}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            <Sliders size={13} />
            <span>Options</span>
          </button>
          <button className="btn btn-primary" style={{ padding: '0.4rem 0.95rem', fontSize: '0.8rem' }}>
            <Play size={13} fill="#000" />
            <span>Run Reconstruction</span>
          </button>
        </div>
      </div>

      {/* 3-Panel IDE Workbench */}
      <div className="workspace-grid-layout">
        {/* Left: Input Assets */}
        <aside className="sidebar-panel">
          <div className="panel-titlebar">
            <span>1. Source Media</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-pure)' }}>
              {project.images ? project.images.length : 0}
            </span>
          </div>

          <div className="panel-scrollable">
            <div className="upload-zone">
              <input 
                type="file" 
                onChange={handleFileUpload} 
                accept="image/*" 
                disabled={uploading}
              />
              <Upload size={20} style={{ color: 'var(--gold-pure)', marginBottom: '0.4rem' }} />
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-white)' }}>
                {uploading ? 'Processing Image...' : 'Click to Upload Source Image'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Supports PNG, JPG or WEBP
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.images && project.images.length > 0 ? (
                project.images.map((img: any) => (
                  <div key={img.id} className="image-record-item">
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-white)' }}>{img.filename}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {img.width && img.height ? `${img.width}×${img.height} px` : 'Loaded'} • {img.id}
                      </div>
                    </div>
                    <FileImage size={16} color="var(--gold-pure)" />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1.25rem 0', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                  No source image yet. Upload one above.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center: Canvas Viewport */}
        <main className="canvas-container">
          <div className="canvas-placeholder-box">
            <Grid size={32} style={{ margin: '0 auto 0.75rem', color: 'var(--gold-pure)' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--text-white)' }}>
              Reconstruction Canvas
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {project.images && project.images.length > 0
                ? 'Source media loaded. Click "Split Image into Tiles" in Stage 2 to begin.'
                : 'Upload a puzzle or document image on the left to start.'}
            </p>
          </div>
        </main>

        {/* Right: Piece Details */}
        <aside className="sidebar-panel-right">
          <div className="panel-titlebar">
            <span>2. Fragment Inspector</span>
            <HelpCircle size={14} color="var(--text-dim)" />
          </div>

          <div className="panel-scrollable">
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-dim)', fontSize: '0.8rem', lineHeight: 1.5 }}>
              <Layers size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              Click any piece from the inventory or canvas to inspect edge gradients, coordinates, and neighbor match confidence.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Workspace;
