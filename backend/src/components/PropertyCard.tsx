import { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PropertyProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  distance?: string;
  dates?: string;
}

const PropertyCard = ({ 
  id, 
  title, 
  location, 
  price, 
  rating, 
  reviewCount, 
  images,
  distance,
  dates
}: PropertyProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <div className="group rounded-xl overflow-hidden flex flex-col">
      {/* Image carousel */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Link to={`/property/${id}`}>
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prevImage(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); nextImage(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
        
        {/* Favorite button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 p-2 rounded-full transition-colors"
        >
          <Heart 
            size={24} 
            className={isFavorited ? 'fill-primary-500 text-primary-500' : 'text-white stroke-[1.5px]'} 
          />
        </button>
      </div>
      
      {/* Content */}
      <div className="mt-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">{location}</h3>
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-current text-gray-900" />
            <span className="text-gray-900">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mt-1">{distance || title}</p>
        {dates && <p className="text-gray-500 text-sm">{dates}</p>}
        
        <p className="mt-auto pt-2">
          <span className="font-semibold">${price}</span>
          <span className="text-gray-500"> night</span>
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;