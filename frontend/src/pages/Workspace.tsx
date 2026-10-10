import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject, uploadImage } from '../api';

const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);

  const fetchProject = () => {
    if (id) getProject(id).then(res => setProject(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && id) {
      await uploadImage(id, e.target.files[0]);
      fetchProject(); // Reload to see new image
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="workspace">
      <div className="workspace-header">
        <h2>{project.name} Workspace</h2>
        <span>Type: {project.puzzle_type}</span>
      </div>
      
      <div className="workspace-layout">
        <aside className="left-panel">
          <h3>Source Images</h3>
          <input type="file" onChange={handleFileUpload} accept="image/*" />
          <ul className="image-list">
            {project.images.map((img: any) => (
              <li key={img.id}>
                {img.filename} ({img.width}x{img.height})
              </li>
            ))}
          </ul>
        </aside>
        
        <main className="center-panel">
          <div className="canvas-placeholder">
            <p>Puzzle Canvas will go here</p>
          </div>
        </main>
        
        <aside className="right-panel">
          <h3>Piece Details</h3>
          <p>Select a piece to view details.</p>
        </aside>
      </div>
    </div>
  );
};

export default Workspace;
