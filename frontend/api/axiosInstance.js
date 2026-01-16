import axios from "axios";

const api = axios.create({
  baseURL: "https://kam-market-2.onrender.com/api",
  withCredentials: true, // utile si tu utilises des cookies
});

// Helpers pour gérer les tokens
const getRefreshToken = () => localStorage.getItem("refreshToken");
api.interceptors.request.use( (config) => { 
const token = localStorage.getItem("accessToken");
  if (token) { config.headers.Authorization = `Bearer ${token}`; 
   } 
  return config; }, (error) => Promise.reject(error) );

const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
   
  } else {
    localStorage.removeItem("accessToken");
    console.log("AccessToken supprimé");
  }
};

const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem("refreshToken", token);
    
  } else {
    localStorage.removeItem("refreshToken");
    console.log("RefreshToken supprimé");
  }
};



// Intercepteur RESPONSE : gère le refresh si le token est expiré
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/users/refresh")) {
      return Promise.reject(error);
    }

    const isTokenExpiredError = error.response?.status === 401 
    && !originalRequest._retry;

    if (isTokenExpiredError) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          console.warn("Aucun refreshToken trouvé, impossible de rafraîchir.");
          return Promise.reject(error);
        }

        const refreshResponse = await api.post("/users/refresh", { refreshToken });

        const newAccessToken = refreshResponse.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.refreshToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("[Refresh] Échec du refresh:", refreshError);
        setAccessToken(null);
        setRefreshToken(null);
        delete api.defaults.headers.common["Authorization"];
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
