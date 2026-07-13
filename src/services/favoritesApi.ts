import axios from "axios";

const API_BASE_URL = "https://kind-link-bridge-backend-1.onrender.com";

export const getFavorites = async (userId: string | number): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/favorites/${userId}`);
  // Assuming response.data is an array of NGO IDs (strings)
  return response.data;
};

export const addFavorite = async (userId: string | number, ngoId: string): Promise<any> => {
  const response = await axios.post(`${API_BASE_URL}/favorites`, {
    user_id: userId,
    ngo_id: ngoId,
  });
  return response.data;
};

export const removeFavorite = async (userId: string | number, ngoId: string): Promise<any> => {
  // Try standard DELETE, if backend requires a POST or specific shape we can handle it
  const response = await axios.delete(`${API_BASE_URL}/favorites/${userId}/${ngoId}`);
  return response.data;
};
