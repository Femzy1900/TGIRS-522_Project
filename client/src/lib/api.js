const API_URL = 'http://localhost:5000';

export const fetchGadgets = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_URL}/gadgets?${query}` : `${API_URL}/gadgets`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch gadgets');
  return res.json();
};

export const searchGadgets = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_URL}/gadgets/search?${query}` : `${API_URL}/gadgets/search`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to search gadgets');
  return res.json();
};

export const fetchGadgetById = async (id) => {
  const res = await fetch(`${API_URL}/gadgets/${id}`);
  if (!res.ok) throw new Error('Failed to fetch gadget details');
  return res.json();
};

export const fetchBrands = async () => {
  const res = await fetch(`${API_URL}/gadgets/brands`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_URL}/gadgets/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const createGadget = async (data) => {
  const res = await fetch(`${API_URL}/gadgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create gadget');
  return res.json();
};

export const updateGadget = async (id, data) => {
  const res = await fetch(`${API_URL}/gadgets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update gadget');
  return res.json();
};

export const deleteGadget = async (id) => {
  const res = await fetch(`${API_URL}/gadgets/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete gadget');
  return res.json();
};

export const verifyAdminPin = async (pin) => {
  const res = await fetch(`${API_URL}/admin/verify-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Invalid PIN');
  return data;
};

export const changeAdminPin = async (oldPin, newPin) => {
  const res = await fetch(`${API_URL}/admin/pin`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPin, newPin }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update PIN');
  return data;
};
