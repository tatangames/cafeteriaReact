// pages/Unauthorized.tsx
export default function Unauthorized() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Acceso denegado 🚫</h1>
                <p>No tenés permisos para acceder a esta sección.</p>
            </div>
        </div>
    );
}
