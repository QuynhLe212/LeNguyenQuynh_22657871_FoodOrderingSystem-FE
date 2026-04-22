import { Outlet, Link } from 'react-router-dom';
import { Clapperboard, User, Film } from 'lucide-react';
import { authStorageKey } from '../api/config';
import type { UserAuthResponse } from '../types/user';

export const Layout = () => {
  const authRaw = localStorage.getItem(authStorageKey);
  const auth = authRaw ? (JSON.parse(authRaw) as UserAuthResponse) : null;

  const handleLogout = () => {
    localStorage.removeItem(authStorageKey);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Clapperboard className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Movie Ticket System</span>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                <Film className="h-4 w-4" />
                Danh sách phim
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                {!auth ? (
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Đăng nhập
                  </Link>
                ) : (
                  <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium">
                    <User className="h-4 w-4" />
                    {auth.user.username} (Dang xuat)
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 flex flex-col items-center">
          <div className="flex justify-center items-center gap-2 mb-4">
             <Clapperboard className="h-5 w-5 text-blue-600" />
             <span className="font-bold text-lg text-gray-900">Movie Ticket System</span>
          </div>
          <p className="text-sm">© 2026 Movie Ticket System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
