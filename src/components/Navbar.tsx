import { Link, useNavigate } from 'react-router-dom';
import { Camera, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-blue-800" />
              <span className="text-xl font-bold text-gray-900">SEO Snap</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/plans" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
              Plans
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/plans"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Plans
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;