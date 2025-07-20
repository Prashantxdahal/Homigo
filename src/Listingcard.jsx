import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Edit, Calendar, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMode } from '../contexts/ModeContext';

const ListingCard = ({ listing, showActions = false, onEdit, onDelete }) => {
  const { user } = useAuth();
  const { mode } = useMode();
  
  // Check if current user owns this listing
  const isOwner = user && String(listing.host_id) === String(user.id);

  // Show edit button only if user is owner
  const showEditButton = isOwner;
  
  // Show book button if user is logged in and NOT the owner
  const showBookButton = user && !isOwner;
  // Show login to book button if user is not logged in
  const showLoginToBook = !user;
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="relative">
        <img
          src={(() => {
            const imageUrl = listing.images?.[0];

            if (!imageUrl) {
              return 'https://placehold.co/400x300/e5e7eb/6b7280?text=No+Image';
            }

            // If it's a base64 data URL, use it directly
            if (imageUrl.startsWith('data:')) {
              return imageUrl;
            }

            // If it's already a full URL, use it as is
            if (imageUrl.startsWith('http')) {
              return imageUrl;
            }

            // If it's a relative path, construct full URL
            return `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          })()}
          alt={listing.title}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => window.location.href = `/listing/${listing.id}`}
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300/f3f4f6/9ca3af?text=Error+Loading+Image';
          }}
        />

        {/* Rating Badge */}
        {listing.averageRating && listing.reviewCount > 0 && (
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{listing.averageRating}</span>
              <span className="text-xs text-gray-500">({listing.reviewCount})</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-semibold text-lg text-gray-900 line-clamp-1 cursor-pointer hover:text-primary-600"
            onClick={() => window.location.href = `/listing/${listing.id}`}
          >
            {listing.title}
          </h3>
          <div className="text-right">
            <span className="text-primary-600 font-bold text-lg">NRS {listing.price}</span>
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
      </div>

      <div className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/listing/${listing.id}`;
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
          >
            View Details
          </button>

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
                className="flex items-center space-x-1 bg-[#003580] text-white px-3 py-2 rounded-md hover:bg-[#0071c2] transition-colors duration-200 text-sm font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </Link>
            )}

            {/* Login to Book button for non-logged in users */}
            {showLoginToBook && (
              <Link
                to="/login"
                className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
              >
                <Calendar className="h-4 w-4" />
                <span>Login to Book</span>
              </Link>
            )}
          </div>

          {showActions && (
            <div className="flex space-x-3">
              <button
                onClick={() => onEdit?.(listing.id)}
                className="text-[#003580] hover:text-[#0071c2] text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(listing.id)}
                className="text-red-600 hover:text-red-800 text-sm font-semibold hover:bg-red-50 px-3 py-1 rounded-lg transition-all duration-200"
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
