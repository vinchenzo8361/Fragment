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
          <h3>Machine Learning Pipeline (Future Phase)</h3>
          <p>
            Unlike naive heuristic scripts that merely compare raw RGB pixels, Fragment will implement pairwise neighbor classifiers trained on synthetic cut datasets in later stages. Edge gradients, color moments, texture frequencies, and contour continuities are synthesized into probabilistic adjacency matrices.
          </p>
          <div className="card-micro-tag">Planned for Later Phases</div>
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
            Your sensitive files never upload to a black-box cloud server. All computer vision mathematics (OpenCV), graph traversal algorithms (Kruskal’s MST / Greedy solvers), and ML models execute directly within your local Python runtime.
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
              <p>For an $N$-piece puzzle, our matching engine calculates an $O(N^2)$ distance matrix evaluating boundary compatibility using Sum-of-Squared Differences (SSD), Mahalanobis color distance, and neighborhood probabilities.</p>
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

      {/* Section 4: Master 11-Stage Roadmap with Technical & Layman Explanations */}
      <div className="roadmap-preview-box">
        <div className="section-label-gold">
          <Boxes size={16} />
          <span>COMPLETE MASTER ROADMAP</span>
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#14161a', marginBottom: '1.5rem' }}>
          Master 11-Stage Engineering Roadmap
        </h3>
        <ul className="roadmap-list">
          {/* Stage 1 */}
          <li>
            <Check size={18} color="var(--gold-primary)" /> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 1 — Foundation & Architecture (Completed)</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> Sets up the app, pages, buttons, and safe storage folders so you can create new projects cleanly.<br />
                <strong>Technical Details:</strong> React 19 + TypeScript frontend with client-side state caching; FastAPI backend with schema validation and permanent PROJ-XXXXXXXX ID generation.
              </div>
            </div>
          </li>

          {/* Stage 2 */}
          <li>
            <span className="bullet-active"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 2 — Image Processing & Tile Import (Active Phase)</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> Upload any picture and slice it into a grid of puzzle pieces with instant thumbnails you can inspect.<br />
                <strong>Technical Details:</strong> Pillow/OpenCV image slicer creating bounded sub-crops, emitting permanent PIECE-0001 IDs, and generating lightweight thumbnail buffers without RAM leaks.
              </div>
            </div>
          </li>

          {/* Stage 3 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 3 — Baseline Square-Tile Solver</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> Solves the puzzle by checking which piece edges have matching colors, like connecting dominoes.<br />
                <strong>Technical Details:</strong> Sum-of-Squared Differences (SSD) color gradient boundary matching combined with a greedy Minimum Spanning Tree (MST) coordinate placement solver.
              </div>
            </div>
          </li>

          {/* Stage 4 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 4 — Real Machine Learning Pipeline (Later Phase)</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> An AI model learns what real piece borders look like from hundreds of example photos to make smarter neighbor guesses.<br />
                <strong>Technical Details:</strong> Synthetic training data generator feeding Scikit-learn random forests or SVMs to predict binary neighbor adjacency probabilities with confusion matrix metrics.
              </div>
            </div>
          </li>

          {/* Stage 5 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 5 — Multi-Photo Support & Known Anchors</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> If you take multiple photos of the same puzzle piece, it ignores duplicates and lets you lock pieces you know are right.<br />
                <strong>Technical Details:</strong> Perceptual hashing (pHash) for image deduplication and an anchor graph constraint engine to fix pre-solved clusters in place.
              </div>
            </div>
          </li>

          {/* Stage 6 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 6 — Interactive Manual Correction</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> Drag and drop pieces on the board, rotate them if they're upside down, and hit undo if you make a mistake.<br />
                <strong>Technical Details:</strong> Canvas drag-and-drop state manager supporting 90°/180°/270° orientation transforms, coordinate locking, and an immutable action undo/redo stack.
              </div>
            </div>
          </li>

          {/* Stage 7 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 7 — Persistence & Export Engine</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> Save your completed reconstructed image in full high resolution, or download a numbered guide map.<br />
                <strong>Technical Details:</strong> Stitching engine generating composite high-res PNGs, numbered placement overlay schematics, and CSV coordinate tables for physical reference.
              </div>
            </div>
          </li>

          {/* Stage 8 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 8 — Straight Shredded Paper Documents</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> Rebuilds documents run through standard strip shredders by lining up vertical strips left to right.<br />
                <strong>Technical Details:</strong> Vertical strip contour extraction, Hough transform skew correction, ink stroke continuation scoring, and 1D horizontal sequence ordering.
              </div>
            </div>
          </li>

          {/* Stage 9 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 9 — Cross-Cut Shredded Paper</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> Solves confidential documents cut into tiny confetti rectangles by matching broken letters and text sentences.<br />
                <strong>Technical Details:</strong> 2D rectangular particle alignment, local OCR (Tesseract) word continuation analysis, and 2D bipartite matching constraints.
              </div>
            </div>
          </li>

          {/* Stage 10 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 10 — Traditional Jigsaw Puzzles</div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>
                <strong>Plain English:</strong> Reconstructs regular classic jigsaw puzzles with curved interlocking tabs and holes.<br />
                <strong>Technical Details:</strong> Non-rectangular contour segmentation, Fourier descriptor curve matching, tab-to-blank geometric interlocking verification, and flat edge border detection.
              </div>
            </div>
          </li>

          {/* Stage 11 */}
          <li>
            <span className="bullet-queue"></span> 
            <div>
              <div style={{ fontWeight: 700, color: '#14161a', fontSize: '0.95rem' }}>Stage 11 — Irregular & Criss-Cross Shreds</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                <strong>Plain English:</strong> Solves randomly torn or hand-ripped documents with jagged, jagged organic edges.<br />
                <strong>Technical Details:</strong> Arbitrary polygon boundary extraction, elastic contour deformation matching, and multi-scale curvature scale space (CSS) alignment.
              </div>
            </div>
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
