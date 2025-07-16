import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, Shield } from 'lucide-react';
import { listingsApi } from '../api/backendApi.jsx';
import ListingCard from '../components/ListingCard';

const Home = () => {
  console.log('Home component rendered');
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const listings = await listingsApi.getListings();
        setFeaturedListings(listings.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003580] to-[#0071c2] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find your perfect stay at Homigo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover unique accommodations around the world
            </p>
            <Link
              to="/listings"
              className="inline-flex items-center bg-white text-[#003580] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <Search className="mr-2 h-5 w-5" />
              Explore Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why choose Homigo?
            </h2>
            <p className="text-gray-600 text-lg">
              We make it easy to find and book the perfect place for your next adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#003580] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                All our listings are verified and meet our high standards for quality and comfort.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#003580] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Join thousands of happy guests and hosts in our growing community.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#003580] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">
                Your payments and personal information are protected with industry-leading security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <Link
              to="/listings"
              className="text-[#003580] hover:text-[#0071c2] font-semibold"
            >
              View All Listings →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#003580] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join millions of travelers who trust Homigo for their perfect stay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/listings"
              className="bg-white text-[#003580] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Find a Place
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#003580] transition-colors duration-200"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
