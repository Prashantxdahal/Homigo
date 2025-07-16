import React, { useState, useEffect } from 'react';
import { Users, Home, Calendar, DollarSign, TrendingUp, MapPin } from 'lucide-react';
import { usersApi, listingsApi, bookingsApi } from '../../api/mockApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, listings, bookings] = await Promise.all([
          usersApi.getUsers(),
          listingsApi.getListings(),
          bookingsApi.getBookings(),
        ]);

        setStats({
          totalUsers: users.length,
          totalListings: listings.length,
          totalBookings: bookings.length,
          totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
        });

        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of platform activity and performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-[#003580]" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
                <p className="text-gray-600">Total Listings</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="text-gray-600">Total Bookings</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+25%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-gray-600">Total Revenue</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+18%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {booking.listing && (
                      <img
                        src={booking.listing.images[0]}
                        alt={booking.listing.title}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.listing?.title || 'Unknown Listing'}
                      </p>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{booking.listing?.location || 'Unknown Location'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#003580]">${booking.totalPrice}</p>
                    <p className="text-sm text-gray-600">{booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <a
                href="/admin/users"
                className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-600">View and manage user accounts</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/listings"
                className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Home className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Listings</p>
                    <p className="text-sm text-gray-600">Review and moderate property listings</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/bookings"
                className="block p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Bookings</p>
                    <p className="text-sm text-gray-600">View and manage all bookings</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
