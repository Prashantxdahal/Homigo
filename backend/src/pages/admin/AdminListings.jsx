import React, { useState, useEffect } from "react";
import { Home, Trash2, Search, MapPin, DollarSign } from "lucide-react";
import { listingsApi } from "../../api/realApi.jsx";

const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingsApi.getListings();
        setListings(data);
        setFilteredListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const filtered = listings.filter(listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.hostName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredListings(filtered);
  }, [listings, searchTerm]);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingsApi.deleteListing(id);
      const updatedListings = listings.filter(listing => listing.id !== id);
      setListings(updatedListings);
      alert('Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003580]"></div>
      </div>
    );
  }

  const totalValue = listings.reduce((sum, listing) => sum + listing.price, 0);
  const averagePrice = listings.length > 0 ? Math.round(totalValue / listings.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Listing Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage property listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-[#003580]" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
                <p className="text-gray-600">Total Listings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${averagePrice}</p>
                <p className="text-gray-600">Average Price</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(listings.map(l => l.location)).size}
                </p>
                <p className="text-gray-600">Unique Locations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search listings by title, location, or host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                    {listing.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{listing.location}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {listing.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#003580] font-bold text-lg">${listing.price}</span>
                      <span className="text-gray-500 text-sm">/night</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      By {listing.hostName}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminListings;
