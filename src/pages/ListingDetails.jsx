import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Wifi, Car, Users, Calendar, Star } from "lucide-react";
import { listingsApi, bookingsApi } from "../api/realApi.jsx";
import { useAuth } from "../contexts/AuthContext";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const shouldShowBooking = searchParams.get('book') === 'true';
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        const data = await listingsApi.getListing(id);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Scroll to booking section if book=true parameter is present
  useEffect(() => {
    if (shouldShowBooking && !loading && listing) {
      setTimeout(() => {
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [shouldShowBooking, loading, listing]);

  useEffect(() => {
    if (checkIn && checkOut && listing) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        setTotalPrice(nights * listing.price);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, listing]);

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut || !listing) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setBookingLoading(true);

    try {
      await bookingsApi.createBooking({
        listingId: listing.id,
        userId: user.id,
        checkIn,
        checkOut,
        totalPrice,
        status: 'confirmed',
      });

      alert('Booking confirmed! You can view your bookings in your profile.');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003580]"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
          <p className="text-gray-600">The listing you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-1" />
            <span>{listing.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <img
                    src={listing.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
                    alt={listing.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=Error+Loading+Image';
                    }}
                  />
                </div>
                {listing.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${listing.title} ${index + 2}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Meet your host</h2>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#003580] rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{listing.hostName}</p>
                  <p className="text-gray-600">Host since {new Date(listing.createdAt).getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div id="booking-section" className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-[#003580]">${listing.price}</span>
                  <span className="text-gray-600">/night</span>
                </div>
                {shouldShowBooking && (
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    📅 Ready to book this amazing place!
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                      />
                      <Calendar className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {totalPrice > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Price</span>
                    <span className="text-xl font-bold text-[#003580]">${totalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                  </p>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={bookingLoading || !checkIn || !checkOut}
                className="w-full bg-[#003580] text-white py-3 px-4 rounded-md font-semibold hover:bg-[#0071c2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Booking...' : 'Book Now'}
              </button>

              {!user && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  <span className="cursor-pointer text-[#003580] hover:underline" onClick={() => navigate('/login')}>
                    Sign in
                  </span>{' '}
                  to book this listing
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
