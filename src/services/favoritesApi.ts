import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://kind-link-bridge-backend-1.onrender.com";

export const getFavorites = async (userId: string | number): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/favorites`);
    if (response.data && Array.isArray(response.data)) {
      const dbFavs = response.data.map((fav: any) => String(fav.ngoId));
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(dbFavs));
      return dbFavs;
    }
  } catch (err) {
    console.error("Failed to fetch favorites from backend", err);
  }
  return JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
};

export const addFavorite = async (userId: string | number, ngoId: string): Promise<any> => {
  const localFavs = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
  if (!localFavs.includes(ngoId)) {
    localFavs.push(ngoId);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(localFavs));
  }
  try {
    await axios.post(`${API_BASE_URL}/api/users/${userId}/favorites`, { ngoId });
  } catch (err) {
    // Ignored fallback - backend does not expose direct POST endpoints for favorites
  }
  return { success: true };
};

export const removeFavorite = async (userId: string | number, ngoId: string): Promise<any> => {
  const localFavs = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
  const updatedFavs = localFavs.filter((id: string) => id !== ngoId);
  localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavs));
  try {
    await axios.delete(`${API_BASE_URL}/api/users/${userId}/favorites/${ngoId}`);
  } catch (err) {
    // Ignored fallback - backend does not expose direct DELETE endpoints for favorites
  }
  return { success: true };
};
