//Esse aqui é um arquivo que vai centralizar as requisições no frontend

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL do backend
});

export default api;
