const API_URL = "http://127.0.0.1:8000/api";

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      device_name: "Web Application",
    }),
  });

  const data = await response.json();
  return { response, data };
};

export const logout = async (token: string) => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  const data = await response.json();
  return { response, data };
};

export const getMe = async (token: string) => {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  const data = await response.json();
  return { response, data };
};