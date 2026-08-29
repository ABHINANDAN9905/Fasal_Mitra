import api from './api';

export const login = async (identifier, password) => {
  const res = await api.post('/auth/login', { identifier, password });
  return res.data;
};

export const signup = async (userData) => {
  const res = await api.post('/auth/signup', userData);
  return res.data;
};

export const demoLogin = async (farmerId) => {
  const res = await api.post('/auth/demo-login', { farmerId });
  return res.data;
};

export const getProfile = async (token) => {
  const res = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const logout = async (token) => {
  try {
    await api.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (e) {
    // Ignore logout error
  }
};

export const getDemoFarmers = async () => {
  try {
    const res = await api.get('/auth/demo-farmers');
    return res.data?.farmers || [];
  } catch (e) {
    return [];
  }
};
