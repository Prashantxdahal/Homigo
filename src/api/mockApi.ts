import { User, Listing, Booking } from '../types';

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@homigo.com', role: 'admin' },
  { id: '2', name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
];

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Cozy Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of the city with modern amenities.',
    price: 120,
    location: 'New York, NY',
    images: [
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking'],
    hostId: '2',
    hostName: 'John Doe',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Luxury Beach House',
    description: 'Stunning beachfront property with panoramic ocean views and private beach access.',
    price: 350,
    location: 'Miami, FL',
    images: [
      'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Hot Tub', 'Parking'],
    hostId: '3',
    hostName: 'Jane Smith',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Mountain Cabin Retreat',
    description: 'Peaceful cabin nestled in the mountains, perfect for a relaxing getaway.',
    price: 180,
    location: 'Aspen, CO',
    images: [
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    amenities: ['WiFi', 'Fireplace', 'Mountain View', 'Hiking Trails'],
    hostId: '2',
    hostName: 'John Doe',
    createdAt: '2024-01-25',
  },
];

const mockBookings: Booking[] = [
  {
    id: '1',
    listingId: '1',
    userId: '3',
    checkIn: '2024-02-15',
    checkOut: '2024-02-20',
    totalPrice: 600,
    status: 'confirmed',
    createdAt: '2024-01-30',
  },
  {
    id: '2',
    listingId: '2',
    userId: '2',
    checkIn: '2024-03-01',
    checkOut: '2024-03-07',
    totalPrice: 2100,
    status: 'pending',
    createdAt: '2024-02-01',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      return { user, token: `token_${user.id}` };
    }
    return null;
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(500);
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) return null;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user'
    };
    mockUsers.push(newUser);
    return { user: newUser, token: `token_${newUser.id}` };
  }
};

// Listings API
export const listingsApi = {
  async getListings(): Promise<Listing[]> {
    await delay(300);
    return [...mockListings];
  },

  async getListing(id: string): Promise<Listing | null> {
    await delay(300);
    return mockListings.find(l => l.id === id) || null;
  },

  async addListing(listing: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing> {
    await delay(500);
    const newListing: Listing = {
      ...listing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockListings.push(newListing);
    return newListing;
  },

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing | null> {
    await delay(500);
    const index = mockListings.findIndex(l => l.id === id);
    if (index === -1) return null;
    mockListings[index] = { ...mockListings[index], ...updates };
    return mockListings[index];
  },

  async deleteListing(id: string): Promise<boolean> {
    await delay(500);
    const index = mockListings.findIndex(l => l.id === id);
    if (index === -1) return false;
    mockListings.splice(index, 1);
    return true;
  },

  async getListingsByHost(hostId: string): Promise<Listing[]> {
    await delay(300);
    return mockListings.filter(l => l.hostId === hostId);
  }
};

// Bookings API
export const bookingsApi = {
  async getBookings(): Promise<Booking[]> {
    await delay(300);
    return mockBookings.map(booking => ({
      ...booking,
      listing: mockListings.find(l => l.id === booking.listingId)
    }));
  },

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    await delay(300);
    return mockBookings
      .filter(b => b.userId === userId)
      .map(booking => ({
        ...booking,
        listing: mockListings.find(l => l.id === booking.listingId)
      }));
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    await delay(500);
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockBookings.push(newBooking);
    return newBooking;
  },

  async deleteBooking(id: string): Promise<boolean> {
    await delay(500);
    const index = mockBookings.findIndex(b => b.id === id);
    if (index === -1) return false;
    mockBookings.splice(index, 1);
    return true;
  }
};

// Users API
export const usersApi = {
  async getUsers(): Promise<User[]> {
    await delay(300);
    return [...mockUsers];
  },

  async deleteUser(id: string): Promise<boolean> {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return false;
    mockUsers.splice(index, 1);
    return true;
  }
};