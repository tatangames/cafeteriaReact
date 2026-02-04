import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", { email });
      toast.success("Te enviamos un enlace al correo 📩");
      setEmail("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al enviar el correo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Correo electrónico
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="correo@ejemplo.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary py-2 text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar enlace"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
