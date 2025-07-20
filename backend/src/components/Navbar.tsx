import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, Globe, AlignJustify, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  
  // Determine if we're on the homepage to decide navbar style
  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage;
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isTransparent 
          ? 'bg-transparent text-white' 
          : 'bg-white text-gray-900 shadow-sm border-b border-gray-200'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-primary-500 text-2xl font-bold">Homigo</span>
          </Link>
          
          {/* Search bar - visible on medium and larger screens */}
          <div className="hidden md:flex items-center mx-auto">
            <div className={`flex items-center rounded-full border ${
              isTransparent ? 'border-gray-300 bg-white/10 backdrop-blur-sm' : 'border-gray-300 bg-gray-50'
            } p-2 shadow-sm hover:shadow transition-all`}>
              <button className="px-4 font-medium text-gray-800">Anywhere</button>
              <span className="h-6 border-r border-gray-300"></span>
              <button className="px-4 font-medium text-gray-800">Any week</button>
              <span className="h-6 border-r border-gray-300"></span>
              <button className="px-4 font-medium text-gray-500">Add guests</button>
              <button className="bg-primary-500 p-2 rounded-full text-white">
                <Search size={18} />
              </button>
            </div>
          </div>
          
          {/* Navigation - visible on medium and larger screens */}
          <div className="hidden md:flex items-center gap-2">
            <button className={`px-4 py-2 rounded-full font-medium ${
              isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              Become a Host
            </button>
            <button className={`p-2 rounded-full ${
              isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              <Globe size={20} />
            </button>
            
            {/* User menu */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 p-2 rounded-full border ${
                  isTransparent ? 'border-gray-300 bg-white/10' : 'border-gray-300'
                } hover:shadow-md transition-all`}
              >
                <Menu size={18} />
                <User size={18} />
              </button>
              
              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Log in
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Sign up
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Become a Host
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Help Center
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-full bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <AlignJustify size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 absolute left-0 right-0 top-full border border-gray-200">
            <Link to="/login" className="block py-2 text-gray-800 hover:text-primary-500">
              Log in
            </Link>
            <Link to="/signup" className="block py-2 text-gray-800 hover:text-primary-500">
              Sign up
            </Link>
            <hr className="my-2 border-gray-200" />
            <button className="block w-full text-left py-2 text-gray-800 hover:text-primary-500">
              Become a Host
            </button>
            <button className="block w-full text-left py-2 text-gray-800 hover:text-primary-500">
              Help Center
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;