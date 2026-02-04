// utils/auth.js

export interface User {
  id: number;
  nombre: string;
  email: string;
}

export interface AuthData {
  token: string;
  tokenType: string;
  user: User;
}

export const getAuth = (): AuthData | null => {
  const raw = localStorage.getItem("auth");
  return raw ? JSON.parse(raw) as AuthData : null;
};

export const setAuth = (
  token: string,
  tokenType: string,
  user: User
): void => {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      token,
      tokenType,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    })
  );
};

export const clearAuth = (): void => {
  localStorage.removeItem("auth");
};

// Funciones auxiliares
export const getToken = (): string | null => {
  const auth = getAuth();
  return auth?.token ?? null;
};

export const getUser = (): User | null => {
  const auth = getAuth();
  return auth?.user ?? null;
};