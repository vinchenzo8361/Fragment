import os
import json
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from datetime import datetime
from PIL import Image

from .models import ProjectCreate, ProjectInfo, ImageSource, generate_id

router = APIRouter(prefix="/api/projects", tags=["projects"])

DATA_DIR = os.path.join("data", "projects")

def get_project_dir(project_id: str) -> str:
    return os.path.join(DATA_DIR, project_id)

def load_project(project_id: str) -> ProjectInfo:
    meta_path = os.path.join(get_project_dir(project_id), "metadata.json")
    if not os.path.exists(meta_path):
        raise HTTPException(status_code=404, detail="Project not found")
    with open(meta_path, "r") as f:
        data = json.load(f)
        return ProjectInfo(**data)

def save_project(project: ProjectInfo):
    p_dir = get_project_dir(project.id)
    os.makedirs(p_dir, exist_ok=True)
    with open(os.path.join(p_dir, "metadata.json"), "w") as f:
        json.dump(project.model_dump(), f, indent=4)

@router.post("/", response_model=ProjectInfo)
def create_project(req: ProjectCreate):
    p_id = generate_id("PROJ")
    project = ProjectInfo(
        id=p_id,
        name=req.name,
        puzzle_type=req.puzzle_type,
        created_at=datetime.utcnow().isoformat(),
        grid_rows=req.grid_rows,
        grid_cols=req.grid_cols
    )
    save_project(project)
    
    # Create subdirectories for images and pieces
    os.makedirs(os.path.join(get_project_dir(p_id), "images"), exist_ok=True)
    os.makedirs(os.path.join(get_project_dir(p_id), "pieces"), exist_ok=True)
    
    return project

@router.get("/{project_id}", response_model=ProjectInfo)
def get_project(project_id: str):
    return load_project(project_id)

@router.get("/", response_model=List[ProjectInfo])
def list_projects():
    if not os.path.exists(DATA_DIR):
        return []
    
    projects = []
    for d in os.listdir(DATA_DIR):
        try:
            projects.append(load_project(d))
        except:
            pass
    return projects

@router.post("/{project_id}/upload")
async def upload_image(project_id: str, file: UploadFile = File(...)):
    project = load_project(project_id)
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    img_id = generate_id("IMG")
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{img_id}{ext}"
    
    images_dir = os.path.join(get_project_dir(project_id), "images")
    file_path = os.path.join(images_dir, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Get image dimensions safely
    width, height = None, None
    try:
        with Image.open(file_path) as img:
            width, height = img.size
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail="Invalid image file format.")
        
    new_image = ImageSource(
        id=img_id,
        filename=file.filename,
        original_path=file_path,
        width=width,
        height=height
    )
    
    project.images.append(new_image)
    save_project(project)
    
    return {"message": "Image uploaded successfully", "image": new_image}
