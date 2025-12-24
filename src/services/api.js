import axios from "axios";

const isTauri =
  typeof window !== "undefined" &&
  window.__TAURI__ !== undefined;

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

/* Interceptor de erro (opcional, mas recomendado) */
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("API error:", error.response.data);
    } else {
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
