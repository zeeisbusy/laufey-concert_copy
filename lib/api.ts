const API_BASE_URL = 'http://localhost:3001/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
};

export const api = {
  auth: {
    register: (data: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
  events: {
    getAll: () => fetchApi('/events'),
    getById: (id: string | number) => fetchApi(`/events/${id}`),
  },
  orders: {
    create: (data: any) => fetchApi('/orders', { method: 'POST', body: JSON.stringify(data) }),
  },
};
