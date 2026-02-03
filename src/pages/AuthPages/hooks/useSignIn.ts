import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {loginApi} from "../../../services/api.ts";

export enum AuthStatus {
    INVALID_EMAIL = "EMAIL_NOT_FOUND",
    INVALID_PASSWORD = "INVALID_PASSWORD",
}

interface User {
    id: number;
    nombre: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    status?: AuthStatus; // Solo viene cuando hay error
    user?: User; // Solo viene cuando es exitoso
    token?: string;
    token_type?: string;
}

export function useSignIn() {
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);


    // validacion del correo
    const validateEmail = (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            setEmailError("El correo es obligatorio");
            return false;
        }

        if (!emailRegex.test(value)) {
            setEmailError("Ingresa un correo válido");
            return false;
        }

        setEmailError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isEmailValid = validateEmail(email);

        if (!password.trim()) {
            setPasswordError("La contraseña es obligatoria");
            return;
        } else {
            setPasswordError("");
        }

        if (!isEmailValid) return;

        setLoading(true);
        try {
            const data = await loginApi(email, password);

            if (data.success && data.token) {

                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        token: data.token,
                        tokenType: data.token_type, // "Bearer"
                        user: {
                            id: data.user.id,
                            nombre: data.user.nombre,
                            email: data.user.email
                        }
                    })
                );

                toast.success("Bienvenido 👋");
            } else {
                // Manejar respuesta no exitosa
                if (data.status === AuthStatus.INVALID_EMAIL) {
                    setEmailError(data.message);
                } else if (data.status === AuthStatus.INVALID_PASSWORD) {
                    setPasswordError(data.message);
                }
                toast.error(data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // El servidor respondió con un error
                const data = error.response.data as LoginResponse;

                if (data.status === AuthStatus.INVALID_EMAIL) {
                    setEmailError(data.message);
                } else if (data.status === AuthStatus.INVALID_PASSWORD) {
                    setPasswordError(data.message);
                }
                toast.error(data.message);
            } else {
                // Error de red o el servidor no respondió
                setPasswordError("Error al conectar con el servidor");
                toast.error("Error de conexión");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        // state
        email,
        emailError,
        password,
        passwordError,
        loading,
        showPassword,

        // setters
        setEmail,
        setPassword,
        setShowPassword,

        // actions
        validateEmail,
        handleSubmit,
    };
}