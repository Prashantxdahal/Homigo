import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMode } from '../contexts/ModeContext';
import { Home, Settings, LogOut, Menu, X } from 'lucide-react';
import ProfilePicture from './ProfilePicture';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useMode();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleModeToggle = () => {
    toggleMode();
    setIsUserMenuOpen(false);
  };

  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/listings', label: 'Listings' },
        { to: '/admin/bookings', label: 'Bookings' },
      ];
    }

    if (mode === 'host') {
      return [
        { to: '/add-listing', label: 'Add Listing' },
        { to: '/my-listings', label: 'My Listings' },
      ];
    }

    return [
      { to: '/listings', label: 'Listings' },
      { to: '/my-bookings', label: 'My Bookings' },
    ];
  };

  return (
    <nav className="bg-[#003580] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8" />
            <span className="text-xl font-bold">Homigo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavLinks().map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-blue-200 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 hover:text-blue-200 transition-colors duration-200"
                >
                  <ProfilePicture 
                    profilePicture={user.profile_picture} 
                    name={user.name} 
                    size="sm" 
                  />
                  <span>{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 flex items-center space-x-3">
                      <ProfilePicture 
                        profilePicture={user.profile_picture} 
                        name={user.name} 
                        size="md" 
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    {user.role !== 'admin' && (
                      <button
                        onClick={handleModeToggle}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Switch to {mode === 'guest' ? 'Host' : 'Guest'} Mode
                      </button>
                    )}

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:text-blue-200 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-600 py-4">
            {getNavLinks().map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 hover:text-blue-200 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="border-t border-blue-600 pt-4 mt-4">
                <div className="pb-2">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-blue-200">{user.email}</p>
                </div>

                {user.role !== 'admin' && (
                  <button
                    onClick={handleModeToggle}
                    className="block w-full text-left py-2 hover:text-blue-200 transition-colors duration-200"
                  >
                    Switch to {mode === 'guest' ? 'Host' : 'Guest'} Mode
                  </button>
                )}

                <Link
                  to="/settings"
                  className="block py-2 hover:text-blue-200 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-300 hover:text-red-200 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-blue-600 pt-4 mt-4">
                <Link
                  to="/login"
                  className="block py-2 hover:text-blue-200 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-blue-200 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
