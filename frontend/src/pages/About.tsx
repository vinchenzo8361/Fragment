import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Cpu, 
  HardDrive, 
  Check, 
  Award, 
  Scan, 
  Compass,
  Boxes,
  Lock
} from 'lucide-react';

const About = () => {
  return (
    <div className="about-container">
      {/* Platform Specification Badge & Heading */}
      <div className="about-header">
        <span className="badge-pill">PLATFORM SPECIFICATION & ARCHITECTURAL OVERVIEW</span>
        <h1>The Science Behind Fragment</h1>
        <p>
          A forensic-grade, local-first engine designed to reconstruct shredded documents, fractured images, and complex jigsaw topologies through computer vision, boundary optimization, and genuine machine learning.
        </p>
      </div>

      {/* Section 1: Executive Mission & Core Philosophy */}
      <div className="about-section">
        <div className="section-label-gold">
          <Compass size={16} />
          <span>PROJECT IDENTITY & PURPOSE</span>
        </div>
        <h2>Why We Built Fragment</h2>
        <p>
          Historical document reconstruction and digital puzzle solving have traditionally been sequestered behind expensive proprietary forensics suites (costing thousands in enterprise licensing) or locked away in obscure academic research repositories.
        </p>
        <p style={{ marginTop: '0.85rem' }}>
          <strong>Fragment changes that.</strong> We engineered a unified, consumer-hardware-friendly suite that runs 100% locally on your computer with zero paid subscriptions, zero API keys, and complete data privacy. Every piece of code is designed to tackle physical destruction—whether a shredded financial sheet, a water-damaged archival parchment, or a scrambled photo puzzle.
        </p>
      </div>

      {/* Section 2: Deep 4-Pillar Architectural Breakdown */}
      <div className="about-grid">
        <div className="about-card">
          <div className="about-card-icon">
            <Cpu size={24} color="var(--gold-primary)" />
          </div>
          <h3>Genuine Machine Learning (Stage 4)</h3>
          <p>
            Unlike naive heuristic scripts that merely compare raw RGB pixels, Fragment implements pairwise neighbor classifiers trained on synthetic cut datasets. Edge gradients, color moments, texture frequencies, and contour continuities are synthesized into probabilistic adjacency matrices.
          </p>
          <div className="card-micro-tag">Scikit-Learn Classifier Pipeline</div>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <HardDrive size={24} color="var(--gold-primary)" />
          </div>
          <h3>Strict 8 GB RAM Guardrails</h3>
          <p>
            Large image processing notoriously crashes consumer laptops through memory bloat. Fragment enforces strict memory budgets: images are split iteratively, compressed thumbnails are cached for UI rendering, and puzzle spatial calculations are executed via lightweight numeric ID matrices.
          </p>
          <div className="card-micro-tag">Zero Memory Leaks</div>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Lock size={24} color="var(--gold-primary)" />
          </div>
          <h3>Immutable Piece IDs</h3>
          <p>
            Every extracted fragment or shred is assigned a permanent, unalterable canonical ID (e.g. <code>PIECE-0001</code>). Even if a piece is manually dragged, rotated 90°, or re-evaluated by the solver, its cryptographic origin remains verifiable for auditability.
          </p>
          <div className="card-micro-tag">Audit-Proof Provenance</div>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Award size={24} color="var(--gold-primary)" />
          </div>
          <h3>100% Free & Zero-Cloud Dependent</h3>
          <p>
            Your sensitive files never upload to a black-box cloud server. All computer vision mathematics (OpenCV), graph traversal algorithms (Kruskal’s MST / Greedy solvers), and ML inferences execute directly within your local Python runtime.
          </p>
          <div className="card-micro-tag">Local-First Sovereign Storage</div>
        </div>
      </div>

      {/* Section 3: Technical Forensics Deep Dive (How the Engine Solves) */}
      <div className="about-section">
        <div className="section-label-gold">
          <Scan size={16} />
          <span>TECHNICAL WORKFLOW DEEP DIVE</span>
        </div>
        <h2>How Fragment Reconstructs Scattered Reality</h2>
        <div className="methodology-steps">
          <div className="method-step-row">
            <div className="method-step-num">01</div>
            <div>
              <h4>Sub-Pixel Boundary Contour Analysis</h4>
              <p>When an image or shred is ingested, our algorithms extract 1-pixel boundary slices across all 4 candidate edges (Top, Right, Bottom, Left). Color histograms and Sobel gradient derivatives are computed to profile the exact transition dynamics.</p>
            </div>
          </div>
          <div className="method-step-row">
            <div className="method-step-num">02</div>
            <div>
              <h4>Pairwise Compatibility Matrix Generation</h4>
              <p>For an $N$-piece puzzle, our matching engine calculates an $O(N^2)$ distance matrix evaluating boundary compatibility using Sum-of-Squared Differences (SSD), Mahalanobis color distance, and machine learning neighborhood probabilities.</p>
            </div>
          </div>
          <div className="method-step-row">
            <div className="method-step-num">03</div>
            <div>
              <h4>Minimum Spanning Tree & Greedy Layout Placement</h4>
              <p>The placement engine initializes the highest-confidence seed piece and expands outward using a maximum-weight spanning tree, locking confirmed neighbors into rigid clusters to prevent exponential search explosions.</p>
            </div>
          </div>
          <div className="method-step-row">
            <div className="method-step-num">04</div>
            <div>
              <h4>Interactive Human-in-the-Loop Refinement</h4>
              <p>In Stage 6, users can visually inspect edge confidence scores, lock known anchors, rotate ambiguous shreds, and seamlessly override model predictions in real time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Comprehensive 11-Stage Roadmap */}
      <div className="roadmap-preview-box">
        <div className="section-label-gold">
          <Boxes size={16} />
          <span>DEVELOPMENT BLUEPRINT</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#121316', marginBottom: '1.25rem' }}>
          Master 11-Stage Engineering Roadmap
        </h3>
        <ul className="roadmap-list">
          <li>
            <Check size={18} color="var(--gold-primary)" /> 
            <span><strong>Stage 1 — Foundation (Completed):</strong> UI scaffolding, REST API endpoints, storage directories, and immutable ID generator.</span>
          </li>
          <li>
            <span className="bullet-active"></span> 
            <span><strong>Stage 2 — Image Processing & Tile Import (Active):</strong> Sub-image cropping, automatic grid partitioner ($R \times C$), piece thumbnailing, and piece inventory UI.</span>
          </li>
          <li>
            <span className="bullet-queue"></span> 
            <span><strong>Stage 3 — Baseline Square-Tile Solver:</strong> Classical CV color gradient matching (SSD) with greedy placement and toggleable Numbered Piece Maps.</span>
          </li>
          <li>
            <span className="bullet-queue"></span> 
            <span><strong>Stage 4 — Real Machine Learning Pipeline:</strong> Synthetic training generator, Scikit-learn pairwise classifier, and Model Lab accuracy metrics.</span>
          </li>
          <li>
            <span className="bullet-queue"></span> 
            <span><strong>Stage 5 — Multi-Photo Support & Known Anchors:</strong> Perceptual hashing (pHash) for deduplication and locked seed clusters.</span>
          </li>
          <li>
            <span className="bullet-queue"></span> 
            <span><strong>Stage 6 — Interactive Manual Correction:</strong> Drag-and-drop piece swapping, 90° tile rotations, undo/redo state history.</span>
          </li>
          <li>
            <span className="bullet-queue"></span> 
            <span><strong>Stage 7 — Persistence & Export Engine:</strong> High-res reconstruction export, Numbered Piece Map PNG, CSV placement table.</span>
          </li>
          <li>
            <span className="bullet-queue"></span> 
            <span><strong>Stage 8-11 — Advanced Fragmentation:</strong> Vertical strip contour shred detection, cross-cut OCR continuity, and organic jigsaw puzzle contour tabs/blanks.</span>
          </li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link to="/projects" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
          <span>Launch Your First Workspace</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default About;
