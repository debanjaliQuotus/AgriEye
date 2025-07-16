export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Remove any double slashes and ensure proper path construction
  const cleanPath = imagePath.replace(/\/+/g, '/').replace(/^\//, '');
  return `${baseUrl}/${cleanPath}`;
};