import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getProjects = () => api.get('/projects/');
export const getProject = (id: string) => api.get(`/projects/${id}`);
export const createProject = (data: any) => api.post('/projects/', data);
export const uploadImage = (id: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/projects/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
