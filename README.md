# Image Solver

**Image Solver** is a functional web application designed to reconstruct original images from scattered, shuffled, shredded, or partially assembled pieces. It uses computer vision, image processing, optimization algorithms, and machine learning.

## Project Structure

- `frontend/`: React + Vite + TypeScript frontend.
- `backend/`: FastAPI backend with OpenCV and Scikit-learn.
  - `api/`: API routes.
  - `projects/`: Project management logic.
  - `image_processing/`: Core image manipulation tools.
  - `piece_detection/`: Detection of puzzle pieces / shreds.
  - `duplicate_detection/`: Identifying duplicates.
  - `puzzle_solver/`: Optimization and constraint resolution.
  - `known_pieces/`: Handling user-anchored pieces.
  - `ml/`: Model inference.
  - `evaluation/`: Validation metrics.
  - `exports/`: Exporting results (images, CSV).
- `training/`: Data generation and training scripts.
- `models/`: Stored ML models.
- `data/`: Sample data and test inputs.
- `tests/`: Automated tests.

## Setup Instructions

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend
1. `cd backend`
2. `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. `pip install -r requirements.txt` (or install manually: fastapi, uvicorn, opencv-python, pillow, scikit-learn, python-multipart)
5. `uvicorn main:app --reload`
