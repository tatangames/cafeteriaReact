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



// ROLES - SOLO LISTADO
export const getRolesTable = async (token: string) => {
  const { data } = await api.get("/admin/roles/tabla", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// BORRAR UN ROL COMPLETO
export const borrarRolGlobal = async (token: string, idrol: number) => {
    const { data } = await api.post(
        "/admin/roles/borrar-global",
        { idrol },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return data;
};


// OBTENER TODOS LOS ROLES
export const getRolePermissionsTable = async (
    token: string,
    idrol: number
) => {
    const { data } = await api.get(
        `/admin/roles/permisos/tabla/${idrol}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return data;
};

// BORRAR UN PERMISO DEL ROL
export const borrarPermisoRol = async (
    token: string,
    idrol: number,
    idpermiso: number
) => {
    const { data } = await api.post(
        "/admin/roles/permiso/borrar",
        {
            idrol,
            idpermiso,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return data;
};

// CREAR UN ROL
export const crearNuevoRol = async (
  token: string,
  nombre: string
) => {
  const { data } = await api.post(
    `/admin/roles/nuevo-rol`,
    { nombre },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};


// AGREGAR UN PERMISO AL ROL
export const agregarPermisoRol = async (
  token: string,
  idrol: number,
  idpermiso: number
) => {
  const { data } = await api.post(
    "/admin/roles/permiso/agregar",
    {
      idrol,
      idpermiso,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return data;
};

// LISTADO DE PERMISOS
export const getPermisosTable = async (token: string) => {
  const { data } = await api.get(
    `/admin/roles/permisos-todos/tabla`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return data;
};


// BORRAR UN PERMISO GLOBAL
export const borrarPermisoGlobal = async (token: string, idpermiso: number) => {
  const { data } = await api.post(
    "/admin/permisos/extra-borrar",
    { idpermiso },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// CREAR UN NUEVO PERMISO
export const crearNuevoPermiso = async (token: string, nombre: string) => {
  const { data } = await api.post(
    "/admin/permisos/extra-nuevo",
    { nombre },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};





export default api;