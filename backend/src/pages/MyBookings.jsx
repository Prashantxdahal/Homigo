import React, { useState, useEffect } from "react";
import { Calendar, CreditCard } from "lucide-react";
import { bookingsApi } from "../api/realApi.jsx";
import { useAuth } from "../contexts/AuthContext";
import BookingCard from '../components/BookingCard';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const data = await bookingsApi.getBookingsByUser(user.id);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsApi.deleteBooking(id);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003580]"></div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.checkIn) >= new Date() && booking.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(booking => 
    new Date(booking.checkOut) < new Date() || booking.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your travel bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-[#003580]" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                <p className="text-gray-600">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">↑</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                <p className="text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
                </p>
                <p className="text-gray-600">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring amazing places and make your first booking.
            </p>
            <a
              href="/listings"
              className="inline-flex items-center bg-[#003580] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#0071c2] transition-colors duration-200"
            >
              Browse Listings
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Trips</h2>
                <div className="space-y-6">
                  {upcomingBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      showActions={true}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Trips</h2>
                <div className="space-y-6">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
