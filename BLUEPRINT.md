# Fragment — Complete Project Specification & Master Blueprint

This document contains everything completed, the exact architecture, hardware constraints, and the roadmap for **Fragment** (formerly *Image Solver*).

---

## 1. Project Summary & Identity

* **Name**: **Fragment**
* **Repository**: `https://github.com/vinchenzo8361/Puzzle-Solver.git`
* **Purpose**: Reconstruct original images and shredded documents from shuffled, cut, or scattered pieces using computer vision, classical optimization, and genuine local machine learning.
* **Cost**: $0 (100% free, local-first, zero paid APIs or subscriptions).
* **Hardware Target**: Tuned for 8 GB RAM laptops (batch processing, lightweight feature arrays, thumbnailing, ID-based puzzle math).

---

## 2. Completed Architecture (Stage 1)

### Frontend (`frontend/`)
* **Stack**: React 19, TypeScript, Vite, React Router, Axios, Lucide Icons.
* **Styling**: Polished dark theme (`#1e1e24`, `#2b2b36`) designed for long sessions.
* **Pages**:
  * `Home.tsx`: Lists existing projects, image counts, and quick access.
  * `ProjectSetup.tsx`: Form to start a new project (Square-Tile, Straight Shreds, Cross-Cut, Traditional Jigsaw).
  * `Workspace.tsx`: 3-panel workspace:
    * Left: Source image uploads and image metadata list.
    * Center: Canvas container for grid rendering.
    * Right: Piece detail inspection panel.

### Backend (`backend/`)
* **Stack**: Python FastAPI, Uvicorn, Pillow, OpenCV, Scikit-learn, Pydantic.
* **Modules**:
  * `projects/models.py`: Pydantic models (`ProjectInfo`, `ImageSource`, `ProjectCreate`) with immutable ID generation (`PROJ-XXXXXXXX`, `IMG-XXXXXXXX`, `PIECE-XXXXXXXX`).
  * `projects/router.py`: REST routes for creating projects, listing projects, fetching project details, and uploading/validating images.
  * `main.py`: CORS configuration and static file mounting (`/data`).
* **Storage**: Local-first storage in `data/projects/{project_id}/`.

---

## 3. The 11 Development Stages

1. **Stage 1 — Foundation** *(Completed)*: Scaffolding, UI, Git, APIs, uploads.
2. **Stage 2 — Image Processing & Tile Import** *(Immediate Next Step)*: 
   * Tile splitter taking an image + grid size (e.g. 4x4).
   * Generates crops, permanent IDs (`PIECE-0001`), and thumbnails.
   * Populates Piece Inventory with thumbnails and metadata.
3. **Stage 3 — Baseline Square-Tile Solver**:
   * Classical CV boundary matching (RGB color gradients, SSD differences).
   * Greedy/MST placement solver.
   * Numbered Piece Map with toggleable IDs and coordinates.
4. **Stage 4 — Real Machine Learning Pipeline**:
   * Synthetic training generator from varied source photos.
   * Scikit-learn classifier predicting pairwise neighbor relationships.
   * Model Lab UI showing true accuracy, precision, recall, and confusion matrix.
5. **Stage 5 — Multi-Photo Support & Known Anchors**:
   * Perceptual hashing (pHash) to detect duplicate piece photos.
   * Workspace to lock known pieces and neighbor clusters.
6. **Stage 6 — Interactive Manual Correction**:
   * Drag-and-drop piece swap, rotation (0°, 90°, 180°, 270°), placement locking, undo/redo.
7. **Stage 7 — Persistence & Exports**:
   * Export high-res reconstructed image, Numbered Piece Map PNG, CSV placement table, and saved project JSON.
8. **Stage 8 — Straight Shredded Paper**:
   * Vertical strip contour detection, skew angle correction, horizontal 1D ordering.
9. **Stage 9 — Cross-Cut Shredded Paper**:
   * Rectangular fragment detection, 2D alignment, local OCR (Tesseract) continuity.
10. **Stage 10 — Traditional Jigsaw Puzzles**:
    * Non-rectangular contour analysis, tab/blank matching, outer border detection.
11. **Stage 11 — Irregular & Criss-Cross Shreds**:
    * Arbitrary polygon boundary matching.

---

## 4. Key Lessons & Things to Remember

1. **Clean Root Directory**: Place `frontend/` and `backend/` directly inside the root `Fragment/` folder (avoid nesting `Jigsaw Solver/image-solver/`).
2. **Vercel vs Local Disk**: Vercel serverless functions have a read-only filesystem. If deploying the backend to the cloud later, use a free cloud storage bucket (like Supabase or S3) rather than writing to a local `data/` folder.
3. **8GB RAM Safeguards**: Never load full-resolution images into memory all at once. Process tiles iteratively, generate compressed thumbnails for the UI, and solve using numerical matrices of IDs.
4. **Permanent IDs**: Never alter or reuse a piece's canonical ID (`PIECE-0001`), even if the user rotates, moves, or removes it.
