import React from 'react';

const ProfilePicture = ({ 
  name, 
  profilePicture, 
  size = 'md',
  className = ''
}) => {
  const [showFallback, setShowFallback] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');

  // Get initials from name
  const getInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl'
  };

  const initials = getInitials(name);

  React.useEffect(() => {
    // Validate and clean the profile picture URL
    if (profilePicture) {
      try {
        // Remove any data URL prefix if it exists
        const url = profilePicture.startsWith('data:') 
          ? profilePicture
          : profilePicture.replace('data:image/webp;bas', '');
        setImageUrl(url);
        setShowFallback(false);
      } catch (error) {
        console.error('Invalid profile picture URL:', error);
        setShowFallback(true);
      }
    } else {
      setShowFallback(true);
    }
  }, [profilePicture]);

  if (!showFallback && imageUrl) {
    return (
      <div className={`${sizeClasses[size]} relative overflow-hidden`}>
        <img
          src={imageUrl}
          alt={`${name}'s profile`}
          className={`w-full h-full rounded-full object-cover border-2 border-gray-200 ${className}`}
          onError={() => setShowFallback(true)}
        />
      </div>
    );
  }

  // Fallback to initials
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold ${className}`}>
      {initials}
    </div>
  );
};

export default ProfilePicture;
