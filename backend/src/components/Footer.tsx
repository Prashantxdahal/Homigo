import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Help Center</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Safety Information</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Cancellation Options</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">COVID-19 Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Community</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Disaster Relief</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Support Refugees</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Combating Discrimination</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Try Hosting</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Protection for Hosts</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Explore Hosting Resources</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Visit Community Forum</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Newsroom</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Careers</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Investors</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary-500">Gift Cards</Link></li>
            </ul>
          </div>
        </div>
        
        <hr className="my-8 border-gray-200" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-0">
            <p className="text-gray-600">© 2025 Homigo, Inc.</p>
            <div className="flex gap-4">
              <Link to="#" className="text-gray-600 hover:text-primary-500">Privacy</Link>
              <Link to="#" className="text-gray-600 hover:text-primary-500">Terms</Link>
              <Link to="#" className="text-gray-600 hover:text-primary-500">Sitemap</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-primary-500">
              <Globe size={18} />
              <span>English (US)</span>
            </button>
            
            <div className="flex items-center gap-4">
              <Link to="#" className="text-gray-600 hover:text-primary-500">
                <Facebook size={20} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-primary-500">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-primary-500">
                <Instagram size={20} />
              </Link>
              <Link to="#" className="text-gray-600 hover:text-primary-500">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;