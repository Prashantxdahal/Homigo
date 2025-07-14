/**
 * Real API service for Homigo app
 * Connects to the PostgreSQL backend API
 */

import { User, Listing, Booking } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated API calls
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  register: async (name: string, email: string, password: string, role: string = 'guest') => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    return response;
  },

  getCurrentUser: async () => {
    const response = await apiCall('/auth/me');
    return response;
  },
};

// Users API
export const usersApi = {
  getProfile: async (userId: string) => {
    const response = await apiCall(`/users/${userId}`);
    return response.data.user;
  },

  updateProfile: async (userId: string, profileData: { name?: string; email?: string; bio?: string }) => {
    const response = await apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data.user;
  },

  changePassword: async (userId: string, passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await apiCall(`/users/change-password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
    return response;
  },
};

// Listings API
export const listingsApi = {
  // Get all active listings with optional filters
  getListings: async (filters: {
    page?: number;
    limit?: number;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/listings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint);
    
    // Transform API response to match frontend interface
    const listings: Listing[] = response.data.listings.map((listing: any) => ({
      id: listing.id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      images: listing.images || [],
      amenities: listing.amenities || [],
      hostId: listing.host.id.toString(),
      hostName: listing.host.name,
      createdAt: new Date(listing.created_at).toISOString().split('T')[0],
    }));

    return {
      listings,
      pagination: response.data.pagination,
    };
  },

  // Get specific listing by ID
  getListing: async (listingId: string): Promise<Listing> => {
    const response = await apiCall(`/listings/${listingId}`);
    const listing = response.data.listing;
    
    return {
      id: listing.id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      images: listing.images || [],
      amenities: listing.amenities || [],
      hostId: listing.host.id.toString(),
      hostName: listing.host.name,
      createdAt: new Date(listing.created_at).toISOString().split('T')[0],
    };
  },

  // Add new listing
  addListing: async (listingData: {
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    amenities: string[];
    hostId: string;
    hostName: string;
  }) => {
    const response = await apiCall('/listings', {
      method: 'POST',
      body: JSON.stringify({
        title: listingData.title,
        description: listingData.description,
        price: listingData.price,
        location: listingData.location,
        images: listingData.images,
        amenities: listingData.amenities,
      }),
    });

    const listing = response.data.listing;
    return {
      id: listing.id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      images: listing.images || [],
      amenities: listing.amenities || [],
      hostId: listing.host.id.toString(),
      hostName: listing.host.name,
      createdAt: new Date(listing.created_at).toISOString().split('T')[0],
    };
  },

  // Update listing
  updateListing: async (listingId: string, listingData: Partial<{
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    amenities: string[];
    status: string;
  }>) => {
    const response = await apiCall(`/listings/${listingId}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
    return response.data.listing;
  },

  // Delete listing
  deleteListing: async (listingId: string) => {
    const response = await apiCall(`/listings/${listingId}`, {
      method: 'DELETE',
    });
    return response;
  },

  // Get listings by host
  getHostListings: async (hostId: string, status?: string) => {
    const endpoint = `/listings/host/${hostId}${status ? `?status=${status}` : ''}`;
    const response = await apiCall(endpoint);
    
    const listings: Listing[] = response.data.listings.map((listing: any) => ({
      id: listing.id.toString(),
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      images: listing.images || [],
      amenities: listing.amenities || [],
      hostId: listing.host.id.toString(),
      hostName: listing.host.name,
      createdAt: new Date(listing.created_at).toISOString().split('T')[0],
    }));

    return listings;
  },
};

// Bookings API
export const bookingsApi = {
  // Create new booking
  createBooking: async (bookingData: {
    listingId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
  }) => {
    const response = await apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        listing_id: parseInt(bookingData.listingId),
        booking_date: new Date().toISOString().split('T')[0],
        check_in_date: bookingData.checkIn,
        check_out_date: bookingData.checkOut,
      }),
    });

    const booking = response.data.booking;
    return {
      id: booking.id.toString(),
      listingId: booking.listing.id.toString(),
      listingTitle: booking.listing.title,
      listingLocation: booking.listing.location,
      hostName: booking.host.name,
      checkIn: booking.check_in_date,
      checkOut: booking.check_out_date,
      guests: 1, // Default since backend doesn't store guests count yet
      totalPrice: booking.total_price,
      status: booking.status,
      createdAt: new Date(booking.created_at).toISOString().split('T')[0],
    };
  },

  // Get user's bookings
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const response = await apiCall(`/bookings/${userId}`);
    
    return response.data.bookings.map((booking: any) => ({
      id: booking.id.toString(),
      listingId: booking.listing.id.toString(),
      listingTitle: booking.listing.title,
      listingLocation: booking.listing.location,
      hostName: booking.host.name,
      checkIn: booking.check_in_date,
      checkOut: booking.check_out_date,
      guests: 1, // Default since backend doesn't store guests count yet
      totalPrice: booking.total_price,
      status: booking.status,
      createdAt: new Date(booking.created_at).toISOString().split('T')[0],
    }));
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, status: string) => {
    const response = await apiCall(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data.booking;
  },

  // Get bookings for a listing (host only)
  getListingBookings: async (listingId: string) => {
    const response = await apiCall(`/bookings/listing/${listingId}`);
    
    return response.data.bookings.map((booking: any) => ({
      id: booking.id.toString(),
      guestName: booking.guest.name,
      guestEmail: booking.guest.email,
      checkIn: booking.check_in_date,
      checkOut: booking.check_out_date,
      totalPrice: booking.total_price,
      status: booking.status,
      createdAt: new Date(booking.created_at).toISOString().split('T')[0],
    }));
  },
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await apiCall('/health');
    return response;
  },
};

// Export the main API object (for backward compatibility)
export const api = {
  auth: authApi,
  users: usersApi,
  listings: listingsApi,
  bookings: bookingsApi,
  health: healthApi,
};
