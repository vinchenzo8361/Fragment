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
        alert('Image upload failed.');
      } finally {
        setUploading(false);
      }
    }
  };

  if (!project) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Loading project workspace...
      </div>
    );
  }

  return (
    <div className="workspace-wrapper">
      {/* Top Application Bar */}
      <div className="workspace-toolbar">
        <div className="workspace-identity">
          <Link to="/projects" className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} title="Back to Projects">
            <ArrowLeft size={15} color="var(--text-primary)" />
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
            <Sliders size={14} color="var(--text-primary)" />
            <span>Options</span>
          </button>
          <button className="btn btn-primary" style={{ padding: '0.4rem 0.95rem', fontSize: '0.8rem' }}>
            <Play size={14} fill="#fff" color="#fff" />
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
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-primary)', fontWeight: 700 }}>
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
              <Upload size={22} color="var(--gold-primary)" style={{ marginBottom: '0.4rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#121316' }}>
                {uploading ? 'Processing Image...' : 'Click to Upload Source Image'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Supports PNG, JPG or WEBP
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.images && project.images.length > 0 ? (
                project.images.map((img: any) => (
                  <div key={img.id} className="image-record-item">
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '190px' }}>
                      <div style={{ fontWeight: 600, color: '#121316' }}>{img.filename}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {img.width && img.height ? `${img.width}×${img.height} px` : 'Loaded'} • {img.id}
                      </div>
                    </div>
                    <FileImage size={18} color="var(--gold-primary)" />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1.25rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  No source image yet. Upload one above.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center: Canvas Viewport */}
        <main className="canvas-container">
          <div className="canvas-placeholder-box">
            <Grid size={36} color="var(--gold-primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem', color: '#121316' }}>
              Reconstruction Canvas
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
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
            <HelpCircle size={15} color="var(--text-secondary)" />
          </div>

          <div className="panel-scrollable">
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: 1.55 }}>
              <Layers size={32} color="var(--gold-primary)" style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              Click any piece from the inventory or canvas to inspect edge gradients, coordinates, and neighbor match confidence.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Workspace;
