import { Navigate } from "react-router";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const auth = localStorage.getItem("auth");

    if (!auth) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}