import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://kind-link-bridge-backend-1.onrender.com";

export interface RecommendationNGO {
  id: string;
  _id?: string;
  name: string;
  category: string;
  description?: string;
  tagline?: string;
  about?: string;
  location?: string;
  locations?: string;
  match_score?: number;
  score?: number;
  matchScore?: number;
  image?: string;
  emoji?: string;
  icon?: string;
}

export const getRecommendations = async (userId: string | number): Promise<RecommendationNGO[]> => {
  const response = await axios.get(`${BACKEND_URL}/api/ngos/recommendations/${userId}`);
  return response.data;
};
