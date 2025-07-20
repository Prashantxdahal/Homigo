import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Eye, EyeOff, Lock, Save, Upload } from 'lucide-react';
import ProfilePicture from '../components/ProfilePicture';

const Settings = () => {
  const { user, updateUser } = useAuth();
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    profile_picture: ''
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  
  // Password security state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [resetSent, setResetSent] = useState(false);
  
  // Loading and success states
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        profile_picture: user.profile_picture || ''
      });
      if (user.profile_picture) {
        setProfilePicturePreview(user.profile_picture);
      }
    }
  }, [user]);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Profile picture must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setProfilePictureFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setProfilePicturePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setProfile(prev => ({ ...prev, profile_picture: '' }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleForgotPassword = async () => {
    if (forgotPasswordEmail) {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      }, 3000);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let profilePictureUrl = profile.profile_picture;

      // Upload profile picture if a new one was selected
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('images', profilePictureFile);

        const uploadResponse = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const uploadData = await uploadResponse.json();

        if (uploadData.success && uploadData.imageUrls && uploadData.imageUrls.length > 0) {
          profilePictureUrl = uploadData.imageUrls[0];
        } else {
          throw new Error('Failed to upload profile picture');
        }
      }

      // Save profile information to backend
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          profile_picture: profilePictureUrl
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update AuthContext with new user data
        const updatedUserData = {
          ...user,
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          profile_picture: profilePictureUrl
        };
        updateUser(updatedUserData);
        
        // Update profile state with the uploaded URL
        setProfile(prev => ({ ...prev, profile_picture: profilePictureUrl }));
        setProfilePicturePreview(profilePictureUrl);
        setProfilePictureFile(null);
        
        setSuccess('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="space-y-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-[#003580] mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            </div>

            {/* Profile Picture Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Picture
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <ProfilePicture 
                    profilePicture={profilePicturePreview || profile.profile_picture} 
                    name={profile.name} 
                    size="xl" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer bg-[#003580] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0071c2] transition-colors duration-200 flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                    {(profilePicturePreview || profile.profile_picture) && (
                      <button
                        onClick={removeProfilePicture}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size of 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                placeholder="Tell others about yourself..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
              />
            </div>

            {/* Save Profile Button */}
            <div className="mt-6">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-[#003580] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#0071c2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </div>

          {/* Password & Security Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Lock className="h-6 w-6 text-[#003580] mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Password & Security</h2>
            </div>

            {/* Change Password Section */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Change Password</h3>
              
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  placeholder="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="New Password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                onClick={handlePasswordChange}
                disabled={passwordLoading}
                className="w-full bg-[#003580] text-white py-3 rounded-lg font-medium hover:bg-[#0071c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>

            {/* Forgot Password Section */}
            <div className="border-t pt-6">
              {!showForgotPassword ? (
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[#003580] hover:text-[#0071c2] font-medium"
                >
                  Forgot Password?
                </button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Reset Password</h3>
                  {resetSent ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-green-600 mr-2" />
                        <p className="text-green-700">Password reset link sent to your email!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003580] focus:border-transparent"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={handleForgotPassword}
                          className="flex-1 bg-[#003580] text-white py-3 rounded-lg font-medium hover:bg-[#0071c2] transition-colors"
                        >
                          Send Reset Link
                        </button>
                        <button
                          onClick={() => setShowForgotPassword(false)}
                          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;