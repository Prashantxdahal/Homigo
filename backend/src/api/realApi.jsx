

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
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

// Listings API
export const listingsApi = {
  async getListings() {
    const response = await apiCall('/listings');
    return response.data.listings;
  },

  async getListing(id) {
    const response = await apiCall(`/listings/${id}`);
    return response.data.listing;
  },

  async createListing(listingData) {
    const response = await apiCall('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
    return response.data.listing;
  },

  async updateListing(id, listingData) {
    const response = await apiCall(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
    return response.data.listing;
  },

  async deleteListing(id) {
    await apiCall(`/listings/${id}`, {
      method: 'DELETE',
    });
  },

  async getHostListings(hostId) {
    const response = await apiCall(`/listings/host/${hostId}`);
    return response.data.listings;
  },

  async getListingsByHost(hostId) {
    const response = await apiCall(`/listings/host/${hostId}`);
    return response.data.listings;
  },
};

// Bookings API
export const bookingsApi = {
  async createBooking(bookingData) {
    const response = await apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return response.data.booking;
  },

  async getUserBookings() {
    const response = await apiCall('/bookings/user');
    return response.data.bookings;
  },

  async getHostBookings() {
    const response = await apiCall('/bookings/host');
    return response.data.bookings;
  },

  async getAllBookings() {
    const response = await apiCall('/bookings');
    return response.data.bookings;
  },

  async updateBookingStatus(id, status) {
    const response = await apiCall(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data.booking;
  },

  async deleteBooking(id) {
    await apiCall(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API
export const usersApi = {
  async getUsers() {
    const response = await apiCall('/users');
    return response.data.users;
  },

  async getUserProfile() {
    const response = await apiCall('/users/profile');
    return response.data.user;
  },

  async updateUserProfile(userData) {
    const response = await apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data.user;
  },

  async deleteUser(id) {
    await apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Real API service for authentication
export const realAuthApi = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          user: {
            id: data.data.user.id.toString(),
            name: data.data.user.name,
            email: data.data.user.email,
            role: 'user', // Default role for now
          },
          token: data.data.token,
        };
      }

      return null;
    } catch (error) {
      console.error('Login API error:', error);
      return null;
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          confirmPassword: password 
        }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          user: {
            id: data.data.user.id.toString(),
            name: data.data.user.name,
            email: data.data.user.email,
            role: 'user', // Default role for now
          },
          token: data.data.token,
        };
      }

      return null;
    } catch (error) {
      console.error('Register API error:', error);
      return null;
    }
  },

  async validateToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: data.data.user.id.toString(),
          name: data.data.user.name,
          email: data.data.user.email,
          role: 'user',
        };
      }

      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  },
};
