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
  FileImage,
  Scissors
} from 'lucide-react';
import { getProject, uploadImage } from '../api';

const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const activeImage = project.images && project.images.length > 0 ? project.images[selectedImageIndex] || project.images[0] : null;

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
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111215' }}>
                {uploading ? 'Processing Image...' : 'Click or Drop Image'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Supports PNG, JPG, or WEBP
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.images && project.images.length > 0 ? (
                project.images.map((img: any, idx: number) => (
                  <div 
                    key={img.id} 
                    className="image-record-item"
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{ 
                      cursor: 'pointer',
                      borderColor: selectedImageIndex === idx ? 'var(--gold-primary)' : 'var(--border-light)',
                      backgroundColor: selectedImageIndex === idx ? 'var(--gold-subtle-bg)' : '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {img.original_path && img.original_path.startsWith('data:') ? (
                        <img 
                          src={img.original_path} 
                          alt="Thumbnail" 
                          style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-light)' }} 
                        />
                      ) : (
                        <FileImage size={20} color="var(--gold-primary)" />
                      )}
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                        <div style={{ fontWeight: 600, color: '#111215', fontSize: '0.825rem' }}>{img.filename}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          {img.width && img.height ? `${img.width}×${img.height} px` : 'Loaded'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1.25rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  No source images yet. Upload an image above!
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center: Live Interactive Canvas Viewport */}
        <main className="canvas-container">
          {activeImage ? (
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxWidth: '90%', maxHeight: '90%' }}>
              <div style={{ 
                background: '#ffffff', 
                padding: '0.75rem', 
                borderRadius: 8, 
                border: '1px solid var(--border-light)', 
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                maxWidth: '100%',
                maxHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={activeImage.original_path.startsWith('data:') ? activeImage.original_path : `http://localhost:8000/${activeImage.original_path}`} 
                  alt={activeImage.filename}
                  style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 4 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111215' }}>
                  {activeImage.filename} ({activeImage.width || 800}×{activeImage.height || 800} px)
                </span>
                <span className="card-micro-tag">
                  {project.grid_rows || 4}×{project.grid_cols || 4} Partition Ready
                </span>
              </div>
            </div>
          ) : (
            <div className="canvas-placeholder-box">
              <Grid size={40} color="var(--gold-primary)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', color: '#111215' }}>
                Reconstruction Canvas
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Upload any picture or shredded fragment using the left panel. Your image will render live here in high resolution!
              </p>
            </div>
          )}
        </main>

        {/* Right: Piece & Partition Inspector */}
        <aside className="sidebar-panel-right">
          <div className="panel-titlebar">
            <span>2. Partition Inspector</span>
            <HelpCircle size={15} color="var(--text-secondary)" />
          </div>

          <div className="panel-scrollable">
            {activeImage ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: 'var(--bg-offwhite)', padding: '1rem', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Scissors size={16} />
                    <span>Grid Configuration</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Target Grid: <strong>{project.grid_rows || 4} Rows × {project.grid_cols || 4} Cols</strong><br/>
                    Total Tiles: <strong>{(project.grid_rows || 4) * (project.grid_cols || 4)} Pieces</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  <Layers size={28} color="var(--gold-primary)" style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
                  Source image is loaded and ready. In Stage 2, clicking <strong>Split Image</strong> will crop individual tile pieces with permanent IDs!
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: 1.55 }}>
                <Layers size={32} color="var(--gold-primary)" style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                Upload a source image on the left to inspect grid partitions and piece metadata.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Workspace;
