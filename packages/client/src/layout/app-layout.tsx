import { Outlet } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { Bell, CheckSquare, LogOut, Settings, User } from "lucide-react";

// App layout with navigation

export const AppLayout = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="h-6 w-6 text-indigo-600" />
                        <span className="font-bold text-xl text-gray-900">TaskMaster</span>
                    </div>

                    {isAuthenticated && (
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                                <Bell size={20} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                                <Settings size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full" />
                                    ) : (
                                        <User size={16} />
                                    )}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <Outlet />
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 py-4">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
