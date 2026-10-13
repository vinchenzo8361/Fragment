import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, HardDrive, Check, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <span className="badge-pill">PLATFORM SPECIFICATION</span>
        <h1>About Fragment</h1>
        <p>
          An algorithmic workspace engineered to reconstruct shredded documents, scrambled images, and scattered jigsaw puzzle fragments without external subscriptions.
        </p>
      </div>

      <div className="about-section">
        <h2>Mission & Design Philosophy</h2>
        <p>
          Document reconstruction and digital puzzle solving are historically locked behind expensive proprietary forensics suites or complex academic codebases. Fragment unites classical image processing, optimization graphs, and machine learning into an accessible, hardware-conscious local desktop suite.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <div className="about-card-icon">
            <Cpu size={22} color="var(--gold-pure)" />
          </div>
          <h3>Genuine Machine Learning</h3>
          <p>
            Unlike static heuristic scripts, Fragment uses pairwise neighbor classifiers trained on synthetic image cuts. Edge gradients, color moments, and texture continuities inform probabilistic adjacency matrices.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <HardDrive size={22} color="var(--gold-pure)" />
          </div>
          <h3>Strict 8 GB RAM Guardrails</h3>
          <p>
            Designed from day one to operate on everyday consumer laptops. Fragment avoids memory overhead by using indexed piece matrices, lazy thumbnail rendering, and streaming tile buffers.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Layers size={22} color="var(--gold-pure)" />
          </div>
          <h3>Deterministic Identity</h3>
          <p>
            Every fragment receives an unalterable canonical ID (e.g. <code>PIECE-0001</code>). Regardless of rotations, user swaps, or graph permutations, provenance remains traceable.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Award size={22} color="var(--gold-pure)" />
          </div>
          <h3>100% Free & Open</h3>
          <p>
            Zero API keys required. All computer vision algorithms (OpenCV), mathematical optimization (MST/Greedy), and ML models run locally in your environment.
          </p>
        </div>
      </div>

      <div className="roadmap-preview-box">
        <h3>Development Stages Overview</h3>
        <ul className="roadmap-list">
          <li><Check size={16} color="var(--gold-pure)" /> <span><strong>Stage 1:</strong> Foundation, Architecture & Storage Scaffolding (Completed)</span></li>
          <li><span className="bullet-active"></span> <span><strong>Stage 2:</strong> Image Processing, Tile Splitter & Piece Inventory (Active)</span></li>
          <li><span className="bullet-queue"></span> <span><strong>Stage 3:</strong> Baseline Square-Tile Boundary Gradient Solver</span></li>
          <li><span className="bullet-queue"></span> <span><strong>Stage 4:</strong> Synthetic Machine Learning Neighborhood Model</span></li>
          <li><span className="bullet-queue"></span> <span><strong>Stage 8-11:</strong> Straight Strips, Cross-Cuts & Classic Jigsaw Puzzles</span></li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link to="/projects" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          <span>Open Projects Directory</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default About;
