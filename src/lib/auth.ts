const BACKEND_URL = "https://kind-link-bridge-backend-1.onrender.com";

export const checkAuth = async () => {
  const res = await fetch(`${BACKEND_URL}/auth/user`, {
    credentials: "include", // 🔴 VERY IMPORTANT
  });

  return res.json(); // returns user object OR null
};
