import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, LogOut, Settings, ChevronDown, Menu, X } from 'lucide-react';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => { 
    logout(); 
    navigate('/'); 
    setShowDropdown(false); 
  };

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      // Close mobile menu when clicking outside
      if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-[#003580]" />
            <span className="text-xl font-bold text-gray-900">Homigo Admin</span>
          </Link>

          {/* Admin Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/admin/dashboard"
              className="text-gray-700 hover:text-[#003580] transition-colors duration-200 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="text-gray-700 hover:text-[#003580] transition-colors duration-200 font-medium"
            >
              Users
            </Link>
            <Link
              to="/admin/listings"
              className="text-gray-700 hover:text-[#003580] transition-colors duration-200 font-medium"
            >
              Listings
            </Link>
            <Link
              to="/admin/bookings"
              className="text-gray-700 hover:text-[#003580] transition-colors duration-200 font-medium"
            >
              Bookings
            </Link>
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-gray-700 hover:text-[#003580] transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-[#003580] text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="hidden md:block font-medium">{user?.name || 'Admin'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs">{user?.email}</p>
                </div>
                
                <Link
                  to="/"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Home className="h-4 w-4 mr-3" />
                  View Site
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-[#003580] transition-colors duration-200"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white mobile-menu-container">
            <div className="px-4 py-2 space-y-1">
              <Link
                to="/admin/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 text-gray-700 hover:text-[#003580] hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 text-gray-700 hover:text-[#003580] hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              >
                Users
              </Link>
              <Link
                to="/admin/listings"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 text-gray-700 hover:text-[#003580] hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              >
                Listings
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setShowMobileMenu(false)}
                className="block px-3 py-2 text-gray-700 hover:text-[#003580] hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              >
                Bookings
              </Link>
              <div className="border-t border-gray-200 pt-2">
                <Link
                  to="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 text-gray-700 hover:text-[#003580] hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  View Site
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#003580] hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
