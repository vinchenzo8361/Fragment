import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api';

const Home = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then(res => setProjects(res.data)).catch(console.error);
  }, []);

  return (
    <div className="home">
      <h1>Projects</h1>
      <Link to="/setup" className="btn btn-primary">Create New Project</Link>
      
      <div className="project-grid">
        {projects.length === 0 ? (
          <p>No projects yet. Create one to get started!</p>
        ) : (
          projects.map((p: any) => (
            <div key={p.id} className="project-card">
              <h3>{p.name}</h3>
              <p>Type: {p.puzzle_type}</p>
              <p>Images: {p.images.length}</p>
              <Link to={`/workspace/${p.id}`} className="btn">Open Workspace</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
