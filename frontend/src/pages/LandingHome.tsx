import { Link } from 'react-router-dom';
import { ArrowRight, Grid, FileText, Scissors, Puzzle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const LandingHome = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-badge">
          <span>FORENSIC RECONSTRUCTION PLATFORM</span>
        </div>
        <h1 className="landing-title">
          Reconstruct Fractured Images & Documents with Precision.
        </h1>
        <p className="landing-subtitle">
          Fragment is a zero-cost, local-first computational suite engineered to solve scrambled square puzzles, shredded paper documents, and complex jigsaw fragments using classical computer vision and local machine learning.
        </p>
        <div className="landing-cta-group">
          <Link to="/projects" className="btn btn-primary" style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}>
            <span>Explore Workspaces</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/about" className="btn btn-secondary" style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}>
            <span>How It Works</span>
          </Link>
        </div>
      </section>

      {/* Feature / Capabilities Matrix */}
      <section className="landing-capabilities">
        <div className="capabilities-header">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Supported Reconstruction Engines</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Modular algorithms tailored to distinct fragmentation geometries.</p>
        </div>

        <div className="capabilities-grid">
          <div className="capability-card">
            <div className="capability-icon">
              <Grid size={22} color="var(--gold-pure)" />
            </div>
            <h3>Square-Tile Matrix</h3>
            <p>Boundary color gradient differences, sum-of-squared differences (SSD), and minimum spanning tree placement solvers.</p>
            <div className="capability-status ready">Engine Ready</div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <FileText size={22} color="var(--gold-pure)" />
            </div>
            <h3>Straight Shredded Paper</h3>
            <p>Contour detection for vertical shredded strips, skew angle correction, text stroke continuity, and horizontal 1D ordering.</p>
            <div className="capability-status ready">Engine Ready</div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <Scissors size={22} color="var(--gold-pure)" />
            </div>
            <h3>Cross-Cut Shreds</h3>
            <p>2D rectangular shred alignment, text baseline tracing via local OCR, and pairwise spatial constraint satisfaction.</p>
            <div className="capability-status ready">Engine Ready</div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <Puzzle size={22} color="var(--gold-pure)" />
            </div>
            <h3>Classic Jigsaw</h3>
            <p>Organic contour analysis, tab and blank curve matching, border piece classification, and corner anchors.</p>
            <div className="capability-status planned">Roadmap Stage 10</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="landing-pillars">
        <div className="pillar-item">
          <ShieldCheck size={20} color="var(--gold-pure)" />
          <div>
            <h4>100% Free & Local-First</h4>
            <p>Zero cloud APIs, zero subscription fees. Runs directly on your device with complete privacy.</p>
          </div>
        </div>
        <div className="pillar-item">
          <Zap size={20} color="var(--gold-pure)" />
          <div>
            <h4>Optimized for 8 GB RAM</h4>
            <p>Batch tile streaming, numerical ID matrices, and thumbnail pipelining prevent memory saturation.</p>
          </div>
        </div>
        <div className="pillar-item">
          <CheckCircle2 size={20} color="var(--gold-pure)" />
          <div>
            <h4>Deterministic Piece IDs</h4>
            <p>Immutable canonical IDs (PIECE-XXXXXXXX) ensure verifiable reconstruction integrity.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingHome;
