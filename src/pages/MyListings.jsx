import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Plus, Home } from "lucide-react";
import { listingsApi } from "../api/realApi.jsx";
import { useAuth } from "../contexts/AuthContext";
import ListingCard from '../components/ListingCard';

const MyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user || !user.id) {
        console.log('No user or user ID available');
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching listings for host:', user.id);
        const data = await listingsApi.getListingsByHost(user.id);
        console.log('Fetched listings:', data);
        
        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.error('Invalid listings data received:', data);
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  const handleEdit = (id) => {
    // In a real app, this would navigate to an edit page
    alert(`Edit functionality would navigate to edit page for listing ${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingsApi.deleteListing(id);
      setListings(prev => prev.filter(listing => listing.id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">Manage your property listings</p>
          </div>
          <Link
            to="/add-listing"
            className="bg-[#003580] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#0071c2] transition-colors duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Listing
          </Link>
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
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
                <p className="text-gray-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">$</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${listings.reduce((sum, listing) => sum + listing.price, 0)}
                </p>
                <p className="text-gray-600">Total Value/Night</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">
              Start earning by listing your first property on Homigo.
            </p>
            <Link
              to="/add-listing"
              className="inline-flex items-center bg-[#003580] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#0071c2] transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
