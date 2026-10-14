import axios from 'axios';

// Key for local storage mock persistence when backend is offline (e.g. deployed on Vercel)
const LOCAL_STORAGE_KEY = 'fragment_projects_cache';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 3000,
});

// Helper for local browser storage
function getLocalProjects(): any[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalProjects(projects: any[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export const getProjects = async () => {
  try {
    const res = await api.get('/projects/');
    return res;
  } catch {
    const local = getLocalProjects();
    return { data: local };
  }
};

export const getProject = async (id: string) => {
  try {
    const res = await api.get(`/projects/${id}`);
    return res;
  } catch {
    const local = getLocalProjects();
    const found = local.find((p: any) => p.id === id);
    if (found) {
      return { data: found };
    }
    return {
      data: {
        id,
        name: 'Sample Project',
        puzzle_type: 'square-tile',
        created_at: new Date().toISOString(),
        images: [],
        grid_rows: 2,
        grid_cols: 2,
      }
    };
  }
};

export const createProject = async (data: any) => {
  try {
    const res = await api.post('/projects/', data);
    const local = getLocalProjects();
    local.unshift(res.data);
    saveLocalProjects(local);
    return res;
  } catch {
    const newId = `PROJ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const newProject = {
      id: newId,
      name: data.name,
      puzzle_type: data.puzzle_type || 'square-tile',
      created_at: new Date().toISOString(),
      images: [],
      grid_rows: data.grid_rows || 2,
      grid_cols: data.grid_cols || 2,
      status: 'created',
    };
    const local = getLocalProjects();
    local.unshift(newProject);
    saveLocalProjects(local);
    return { data: newProject };
  }
};

export const deleteProject = async (id: string) => {
  try {
    await api.delete(`/projects/${id}`);
  } catch {
    // Ignore error if backend offline
  }
  const local = getLocalProjects().filter((p: any) => p.id !== id);
  saveLocalProjects(local);
  return { success: true };
};

export const uploadImage = async (id: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post(`/projects/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const local = getLocalProjects();
        const proj = local.find((p: any) => p.id === id);
        const imgId = `IMG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const newImg = {
          id: imgId,
          filename: file.name,
          original_path: reader.result as string,
          width: 800,
          height: 800,
        };
        if (proj) {
          if (!proj.images) proj.images = [];
          proj.images.push(newImg);
          saveLocalProjects(local);
        }
        resolve({ data: { message: 'Image uploaded locally', image: newImg } });
      };
      reader.readAsDataURL(file);
    });
  }
};

export const deleteImage = async (projectId: string, imageId: string) => {
  try {
    await api.delete(`/projects/${projectId}/images/${imageId}`);
  } catch {
    // Ignore error if backend offline
  }
  const local = getLocalProjects();
  const proj = local.find((p: any) => p.id === projectId);
  if (proj && proj.images) {
    proj.images = proj.images.filter((img: any) => img.id !== imageId);
    saveLocalProjects(local);
  }
  return { success: true };
};

export default api;
