import { Navigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

// Protected route wrapper

export const ProtectedRoute: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
