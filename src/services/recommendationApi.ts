import axios from "axios";

const ML_BASE_URL = "http://127.0.0.1:8000";

export interface RecommendationNGO {
  id: string;
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
  const response = await axios.get(`${ML_BASE_URL}/recommend/${userId}`);
  return response.data;
};
