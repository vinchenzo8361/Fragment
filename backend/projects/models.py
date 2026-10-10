from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class ImageSource(BaseModel):
    id: str
    filename: str
    original_path: str
    width: Optional[int] = None
    height: Optional[int] = None

class ProjectCreate(BaseModel):
    name: str
    puzzle_type: str = "square-tile"
    grid_rows: Optional[int] = None
    grid_cols: Optional[int] = None

class ProjectInfo(BaseModel):
    id: str
    name: str
    puzzle_type: str
    created_at: str
    images: List[ImageSource] = []
    grid_rows: Optional[int] = None
    grid_cols: Optional[int] = None
    status: str = "created"

def generate_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"
