import React, { createContext, useContext, useState, useEffect } from 'react';
import { realAuthApi } from '../api/realApi.jsx';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  console.log('AuthProvider rendered');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // First set the stored user data immediately
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Then validate token with backend
          const validUser = await realAuthApi.validateToken(token);
          if (validUser) {
            // Update with latest user data from backend
            const updatedUser = {
              ...parsedUser,
              ...validUser,
              profile_picture: validUser.profile_picture || parsedUser.profile_picture
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('profile_picture');
            setUser(null);
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('profile_picture');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await realAuthApi.login(email, password);
      if (result) {
        const userWithPicture = {
          ...result.user,
          profile_picture: result.user.profile_picture || localStorage.getItem('profile_picture')
        };
        setUser(userWithPicture);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(userWithPicture));
        if (userWithPicture.profile_picture) {
          localStorage.setItem('profile_picture', userWithPicture.profile_picture);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const result = await realAuthApi.register(name, email, password);
      if (result) {
        const userWithPicture = {
          ...result.user,
          profile_picture: result.user.profile_picture || localStorage.getItem('profile_picture')
        };
        setUser(userWithPicture);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(userWithPicture));
        if (userWithPicture.profile_picture) {
          localStorage.setItem('profile_picture', userWithPicture.profile_picture);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    // Store the profile picture temporarily before clearing
    const profilePicture = user?.profile_picture || localStorage.getItem('profile_picture');
    
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userMode');
    
    // Keep the profile picture in storage for next login if it exists
    if (profilePicture) {
      localStorage.setItem('profile_picture', profilePicture);
    }
  };

  const updateUser = (userData) => {
    if (user) {
      try {
        // Preserve existing user data and merge with new data
        const updatedUser = {
          ...user,
          ...userData,
          profile_picture: userData.profile_picture || user.profile_picture
        };
        
        // Update state
        setUser(updatedUser);
        
        // Update localStorage with complete user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Store profile picture URL separately for quick access
        if (userData.profile_picture) {
          localStorage.setItem('profile_picture', userData.profile_picture);
        }
        
        return true;
      } catch (error) {
        console.error('Error updating user:', error);
        return false;
      }
    }
    return false;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
