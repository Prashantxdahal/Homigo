import React from 'react';
import { Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-primary text-white py-16 border-t border-primary-700/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                <Home className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Homigo</span>
            </div>
            <p className="text-white/80 max-w-md text-lg leading-relaxed">
              Find your perfect stay with Homigo. Discover unique accommodations
              around Nepal and beyond, or become a host and share your space.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-lg">Company</h3>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">Press</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-lg">Support</h3>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">Safety</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/80 font-medium">&copy; {new Date().getFullYear()} Homigo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
