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


// INICIO DE SESION
export const loginApi = async (email: string, password: string) => {
  const { data } = await api.post("/login", {
    email,
    password,
    device_name: "Web Application",
  });
  return data;
};


// CERRAR SESION
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

// SOLICITAR RESET CONTRASEÑA
export const sendResetPasswordEmail = async (email: string) => {
  const { data } = await api.post("/admin/enviar/correo/password", {
    email,
  });

  return data;
};


// VALIDAR TOKEN DE RESET
export const validateResetToken = async (
    token: string,
    email: string
) => {
    const { data } = await api.post(
        "/validate-reset-token",
        {
            token,
            email,
        }
    );

    return data;
};

// CONFIRMAR / ACTUALIZAR CONTRASEÑA
export const confirmResetPassword = async (
    token: string,
    email: string,
    password: string,
    passwordConfirmation: string
) => {
    const { data } = await api.post(
        "/reset-password-confirm",
        {
            token,
            email,
            password,
            password_confirmation: passwordConfirmation,
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