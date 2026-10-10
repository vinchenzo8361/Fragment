import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api';

const ProjectSetup = () => {
  const [name, setName] = useState('');
  const [puzzleType, setPuzzleType] = useState('square-tile');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createProject({ name, puzzle_type: puzzleType });
      navigate(`/workspace/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="setup-container">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label>Project Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="e.g. Cat Puzzle"
          />
        </div>
        <div className="form-group">
          <label>Puzzle Type</label>
          <select value={puzzleType} onChange={(e) => setPuzzleType(e.target.value)}>
            <option value="square-tile">Square-Tile Image Puzzle</option>
            <option value="straight-strip">Straight Shredded Paper</option>
            <option value="cross-cut">Cross-Cut Shredded Paper</option>
            <option value="traditional" disabled>Traditional Jigsaw (Coming Soon)</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Project</button>
      </form>
    </div>
  );
};

export default ProjectSetup;
