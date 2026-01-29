import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b-2 border-ink-900 sticky top-0 z-40" style={{ boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
             <div className="bg-ink-900 text-white p-1 rounded-sm transform -rotate-3">
               <LogOut size={20} className="stroke-[3]" /> {/* Using LogOut icon as placeholder logo to doodle */}
             </div>
            <h1 className="text-3xl font-display text-ink-900 tracking-wide underline decoration-primary-500 decoration-wavy decoration-2 underline-offset-4">
              My Doodles
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                <User size={20} />
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.email}
                </span>
              </button>

              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl py-2 z-20 animate-scale-in">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
