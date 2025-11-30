const API_BASE_URL = 'http://localhost:8000/api';

export const analyzeSkinTone = async (imageBlob, userName) => {
  const formData = new FormData();
  formData.append('image', imageBlob, 'capture.jpg');
  if (userName) {
    formData.append('name', userName);
  }
  
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Analysis failed');
  }
  
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  return response.json();
};