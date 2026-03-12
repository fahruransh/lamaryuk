import axios from 'axios';

// Di Vercel: production → API ada di /api (same domain, tidak perlu BASE_URL)
// Di local  : development → arahkan ke Express localhost:3001
const BASE_URL = import.meta.env.PROD
  ? ''                                                      // Vercel serverless
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001'); // Local dev

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Unwrap response data, throw on error
api.interceptors.response.use(
  res  => res.data,
  err  => {
    const msg = err.response?.data?.message || err.message || 'Terjadi kesalahan jaringan';
    return Promise.reject(new Error(msg));
  }
);

export const getApplications   = ()          => api.get('/api/applications');
export const createApplication = (data)      => api.post('/api/applications', data);
export const updateApplication = (id, data)  => api.put(`/api/applications/${id}`, data);
export const deleteApplication = (id)        => api.delete(`/api/applications/${id}`);
export const checkHealth       = ()          => api.get('/api/health');

export default api;
