import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Upload, 
  ArrowLeft, 
  Layers, 
  Grid, 
  Play, 
  Sliders
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
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Loading project...
      </div>
    );
  }

  return (
    <div className="workspace-wrapper">
      {/* Top Application Bar */}
      <div className="workspace-toolbar">
        <div className="workspace-identity">
          <Link to="/" className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} title="Back">
            <ArrowLeft size={14} />
          </Link>
          <span className="workspace-title">{project.name}</span>
          <span className="badge-tag">
            {project.puzzle_type.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            {project.id}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            <Sliders size={13} />
            <span>Options</span>
          </button>
          <button className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
            <Play size={13} />
            <span>Solve</span>
          </button>
        </div>
      </div>

      {/* 3-Panel IDE Workbench */}
      <div className="workspace-grid-layout">
        {/* Left: Input Assets */}
        <aside className="sidebar-panel">
          <div className="panel-titlebar">
            <span>Sources</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
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
              <Upload size={18} style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                PNG, JPG or WEBP
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {project.images && project.images.length > 0 ? (
                project.images.map((img: any) => (
                  <div key={img.id} className="image-record-item">
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{img.filename}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        {img.width && img.height ? `${img.width}×${img.height}` : 'Uploaded'}
                      </div>
                    </div>
                    <span className="badge-tag" style={{ fontSize: '0.65rem' }}>IMG</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                  No source files uploaded
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center: Canvas Viewport */}
        <main className="canvas-container">
          <div className="canvas-placeholder-box">
            <Grid size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
              Reconstruction Canvas
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              {project.images && project.images.length > 0
                ? 'Source loaded. Ready for tile splitting in Stage 2.'
                : 'Upload a source image from the left panel to initialize.'}
            </div>
          </div>
        </main>

        {/* Right: Piece Details */}
        <aside className="sidebar-panel-right">
          <div className="panel-titlebar">
            <span>Inspector</span>
            <Layers size={14} />
          </div>

          <div className="panel-scrollable">
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
              Select a piece or tile to inspect its properties and neighbor scores.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Workspace;
