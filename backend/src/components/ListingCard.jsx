import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Edit, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMode } from '../contexts/ModeContext';

const ListingCard = ({ listing, showActions = false, onEdit, onDelete }) => {
  const { user } = useAuth();
  const { mode } = useMode();
  
  // Check if current user owns this listing
  const isOwner = user && listing.host_id === parseInt(user.id);
  
  // Show edit button if user is owner OR in host mode
  const showEditButton = isOwner || (mode === 'host' && user);
  
  // Show book button if user is logged in and NOT the owner
  const showBookButton = user && !isOwner;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={listing.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={listing.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
          }}
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">4.8</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {listing.title}
          </h3>
          <div className="text-right">
                <span className="text-[#003580] font-bold text-lg">NRS {listing.price}</span>
            <span className="text-gray-500 text-sm">/night</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{listing.location}</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {listing.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="text-gray-500 text-xs px-2 py-1">
              +{listing.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/listing/${listing.id}`}
            className="bg-[#003580] text-white px-4 py-2 rounded-md hover:bg-[#0071c2] transition-colors duration-200 text-sm font-medium"
          >
            View Details
          </Link>

          <div className="flex space-x-2">
            {/* Edit button for owners or host mode */}
            {showEditButton && (
              <Link
                to={`/edit-listing/${listing.id}`}
                className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
            )}
            
            {/* Book button for non-owners */}
            {showBookButton && (
              <Link
                to={`/listing/${listing.id}?book=true`}
                className="flex items-center space-x-1 bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200 text-sm font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </Link>
            )}
          </div>

          {showActions && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit?.(listing.id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(listing.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
