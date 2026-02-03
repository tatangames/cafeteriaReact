import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { login } from "../../services/api";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Validar email
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

  // ✅ Submit login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);

    if (!password.trim()) {
      setPasswordError("La contraseña es obligatoria");
    } else {
      setPasswordError("");
    }

    if (!isEmailValid || !password.trim()) {
      return;
    }

    // 🎯 Llamar a la API usando el servicio
    setLoading(true);

    try {
      const { response, data } = await login(email, password);

      console.log("Respuesta completa:", data);
     // console.log("Status:", response.status);

      if (response.ok) {
        // ✅ Login exitoso
        console.log("✅ LOGIN EXITOSO");
        console.log("Token:", data.token);
        console.log("Usuario:", data.user);

        // Guardar token en localStorage
        localStorage.setItem("token", data.token);

        // Aquí puedes redirigir al dashboard
        // navigate("/dashboard");
      } else {
        // ❌ Error de login
        console.log("❌ ERROR DE LOGIN");
        console.log("Mensaje:", data.message);

        // Mostrar error según el mensaje
        if (data.message.includes("correo")) {
          setEmailError(data.message);
        } else if (data.message.includes("contraseña")) {
          setPasswordError(data.message);
        }
      }
    } catch (error) {
      console.error("❌ ERROR DE CONEXIÓN:", error);
      setPasswordError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Forgot password click
  const handleForgotPassword = () => {
    console.log("CLICK EN RECUPERAR CONTRASEÑA", email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#6F491A] pt-20">

      {/* Logo */}
      <img
        src="/images/logo/logoe.jpg"
        alt="Logo"
        className="h-32 mb-6"
      />

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">

        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">
            Iniciar sesión
          </h1>
          <p className="text-sm text-gray-500">
            Ingresa tu correo y contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">

            {/* Email */}
            <div>
              <Label>
                Correo electrónico <span className="text-error-500">*</span>
              </Label>
              <Input
                className={emailError ? "border-red-500 focus:ring-red-500" : ""}
                type="email"
                value={email}
                placeholder="correo@ejemplo.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label>
                Contraseña <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Ingresa tu contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 size-5" />
                  )}
                </span>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                to="/reset-password"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}