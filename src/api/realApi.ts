import { User } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Real API service for authentication
export const realAuthApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
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

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string } | null> {
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

  async validateToken(token: string): Promise<User | null> {
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
