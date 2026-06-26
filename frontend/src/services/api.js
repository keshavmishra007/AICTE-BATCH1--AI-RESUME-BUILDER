import axios from 'axios';

const defaultBaseUrl = import.meta.env.PROD ? '/_/backend' : 'http://localhost:5000';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('careerforge_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function downloadUrl(path) {
  return `${api.defaults.baseURL}${path}`;
}

export async function downloadFile(path, filename) {
  const { data } = await api.get(path, { responseType: 'blob' });
  const url = URL.createObjectURL(data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
