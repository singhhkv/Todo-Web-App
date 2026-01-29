import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    CheckSquare,
    LogOut,
    PlusCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const menuItems = [
        { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
    ];

    return (
        <aside className="w-20 lg:w-64 h-screen py-6 pl-6 pr-2 fixed left-0 top-0 flex flex-col z-50">
            {/* Glass Container */}
            <div className="flex-1 glass-panel flex flex-col px-4 py-6 overflow-hidden relative">

                {/* Decorative Background Glow for Sidebar */}
                <div className="absolute top-0 left-0 w-full h-32 bg-brand-500/10 blur-3xl rounded-full -translate-y-1/2 pointer-events-none"></div>

                {/* Logo Area */}
                <div className="flex items-center gap-3 px-2 mb-12 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow flex items-center justify-center shrink-0 ring-4 ring-brand-500/20">
                        <CheckSquare size={20} className="text-white" strokeWidth={3} />
                    </div>
                    <div className="hidden lg:block">
                        <h1 className="font-display font-bold text-xl tracking-tight text-white leading-none">
                            To Do App
                        </h1>
                        <p className="text-[10px] text-brand-300 font-medium tracking-wide uppercase mt-1">
                            Task Manager
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-3 relative z-10">
                    <div className="px-3 mb-2 hidden lg:block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Main Menu
                    </div>

                    {menuItems.map((item) => {
                        const ActiveIcon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);

                        return (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${isActive
                                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow translate-x-1'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                                    }`}
                            >
                                <ActiveIcon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'animate-pulse-slow' : ''} />
                                <span className={`font-medium text-[15px] hidden lg:block`}>
                                    {item.label}
                                </span>

                                {/* Active Indicator (Glow) */}
                                {isActive && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] hidden lg:block" />
                                )}
                            </button>
                        );
                    })}


                </nav>

                {/* User / Bottom Section */}
                <div className="mt-auto relative z-10">
                    <div className="p-4 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-purple to-brand-500 p-[2px] shadow-lg shrink-0">
                                <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center">
                                    <span className="font-bold text-sm text-white">
                                        {user?.email?.[0].toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            <div className="hidden lg:block min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.email?.split('@')[0]}</p>

                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-dark-900/50 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/5 transition-colors text-xs font-medium"
                        >
                            <LogOut size={14} />
                            <span className="hidden lg:inline">Sign Out</span>
                        </button>
                    </div>
                </div>

            </div>
        </aside>
    );
};
