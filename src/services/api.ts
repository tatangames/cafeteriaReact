import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Funciones API
export const loginApi = async (email: string, password: string) => {
  const { data } = await api.post("/login", {
    email,
    password,
    device_name: "Web Application",
  });
  return data;
};

export const logout = async (token: string) => {
  const { data } = await api.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
  );
  return data;
};

export const getMe = async (token: string) => {
  const { data } = await api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export default api;