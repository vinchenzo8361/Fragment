import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  UploadCloud, 
  ChevronLeft, 
  Layers, 
  Grid, 
  Sparkles, 
  Info, 
  Maximize2 
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
        alert('Image upload failed. Ensure the backend is running.');
      } finally {
        setUploading(false);
      }
    }
  };

  if (!project) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
        Loading reconstruction studio...
      </div>
    );
  }

  return (
    <div className="workspace-container">
      {/* Workspace Sub-header */}
      <div className="workspace-topbar">
        <div className="workspace-project-info">
          <Link to="/" className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} title="Back to Projects">
            <ChevronLeft size={16} />
          </Link>
          <div>
            <div className="workspace-project-title">{project.name}</div>
          </div>
          <span className="workspace-badge">
            {project.puzzle_type.toUpperCase()}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {project.id}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <Sparkles size={14} />
            <span>Auto Solve</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Split Workspace */}
      <div className="workspace-body">
        {/* Left Panel: Source Images & Inputs */}
        <aside className="panel-left">
          <div className="panel-header">
            <span className="panel-title">
              <UploadCloud size={16} color="#818cf8" />
              Source Media
            </span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              {project.images ? project.images.length : 0} FILE{project.images?.length === 1 ? '' : 'S'}
            </span>
          </div>

          <div className="panel-content">
            {/* Upload Dropzone */}
            <div className="dropzone-box">
              <input 
                type="file" 
                onChange={handleFileUpload} 
                accept="image/*" 
                disabled={uploading}
              />
              <UploadCloud size={24} className="dropzone-icon" />
              <div className="dropzone-text">
                {uploading ? 'Processing Image...' : 'Drop image or browse'}
              </div>
              <div className="dropzone-subtext">PNG, JPG, WEBP up to 25MB</div>
            </div>

            {/* List of Source Images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.images && project.images.length > 0 ? (
                project.images.map((img: any) => (
                  <div key={img.id} className="source-image-item">
                    <div className="source-image-meta">
                      <div className="source-image-name" title={img.filename}>
                        {img.filename}
                      </div>
                      <div className="source-image-res">
                        {img.width && img.height ? `${img.width}×${img.height} px` : 'Processing'} • {img.id}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  No source images yet. Upload one above.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center Panel: Interactive Reconstruct Canvas */}
        <main className="panel-center">
          <div className="canvas-viewport">
            <div className="canvas-empty-state">
              <Grid className="canvas-empty-icon" />
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                Reconstruction Matrix
              </h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                {project.images && project.images.length > 0
                  ? 'Source image loaded. Ready to split into puzzle tiles in Stage 2.'
                  : 'Upload a source image on the left to begin piece extraction and reconstruction.'}
              </p>
            </div>
          </div>
        </main>

        {/* Right Panel: Piece & Inspection Inspector */}
        <aside className="panel-right">
          <div className="panel-header">
            <span className="panel-title">
              <Layers size={16} color="#818cf8" />
              Piece Inspector
            </span>
            <Info size={14} color="var(--text-dim)" />
          </div>

          <div className="panel-content">
            <div className="empty-inspector-state">
              <Maximize2 size={32} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <div>Select a fragment on the canvas or piece list to inspect edge gradients and confidence.</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Workspace;
