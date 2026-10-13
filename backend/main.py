from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from projects.router import router as projects_router

app = FastAPI(title="Fragment API", description="API for reconstructing scattered images and puzzles.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects_router)

# Mount the static data directory so frontend can load images
os.makedirs("data", exist_ok=True)
app.mount("/data", StaticFiles(directory="data"), name="data")

@app.get("/")
def read_root():
    return {"message": "Fragment API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
